import DottedPrompt from '@/components/shared/DottedPrompt';
import {
  Box,
  Button,
  Center,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import Editor, { Monaco, OnMount } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { C, fromHex } from 'lucid-cardano';
import { jsonToPlutusHex } from '@/utils/crypto/plutus';
import { isHex } from '@/utils/strings';
import theme from '@/theme';

interface PutusDataCreatorProps {
  title: string;
}

const editorOptions = {
  minimap: { enabled: false },
};

const PlutusDataCreator: React.FC<PutusDataCreatorProps> = ({ title }) => {
  const { onClose, onOpen, isOpen } = useDisclosure();
  const [dataHash, setDataHash] = useState<string | undefined>();

  const handleValidParsing = (obj: any) => {
    try {
      const res = jsonToPlutusHex(obj);
      const hash = C.hash_plutus_data(
        C.PlutusData.from_bytes(fromHex(res)),
      ).to_hex();
      setDataHash(hash);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const detectErrors = (
    code: string,
    writer: { error: string; keyVal?: [string, string]; code?: string }[] = [],
  ) => {
    let obj: any;

    try {
      obj = JSON.parse(code);
    } catch (error) {
      return [{ error: 'Invalid JSON' }];
    }

    Object.entries(obj).forEach(([k, v]: any) => {
      switch (k) {
        case 'constructor':
          if (!obj.fields) {
            writer = [
              {
                error:
                  'A field that specifies a constructor needs to have a `fields` key on the same level',
                keyVal: [k, v],
              },
            ];
          }
          if (Object.keys(obj).length > 2) {
            writer.push({
              error:
                'Too many keys. Only `constructor` and `fields` are allowed',
              keyVal: [k, v],
            });
          }
          break;
        case 'fields':
          writer = v.reduce(
            (acc: any[], curr: string) =>
              acc.concat(detectErrors(JSON.stringify(curr)), writer),
            [],
          );
          if (typeof obj.constructor !== 'number') {
            writer.push({
              error:
                'A key that specifies fields needs to have a `constructor` key at the same level',
              keyVal: [k, v],
            });
          }
          if (Object.keys(obj).length > 2) {
            writer.push({
              error:
                'Too many keys. Specify only one data type per nesting level',
              keyVal: [k, v],
            });
          }
          break;
        case 'list':
          writer = v.reduce(
            (acc: any[], curr: string) =>
              acc.concat(detectErrors(JSON.stringify(curr)), writer),
            [],
          );
          if (Object.keys(obj).length > 1) {
            writer.push({
              error:
                'Too many keys. Specify only one data type per nesting level',
              keyVal: [k, v],
            });
          }
          break;
        case 'int':
          if (typeof v !== 'number' || v % 1 !== 0 || v < 0) {
            writer = [
              {
                error: 'Int field must be a positive number',
                keyVal: [k, v],
              },
            ];
          }
          if (Object.keys(obj).length > 1) {
            writer.push({
              error:
                'Too many keys. Specify only one data type per nesting level',
              keyVal: [k, v],
            });
          }
          break;
        case 'string':
          if (typeof v !== 'string') {
            writer = [
              {
                error: 'String field needs to be a string',
                keyVal: [k, v],
              },
            ];
          }
          if (Object.keys(obj).length > 1) {
            writer.push({
              error:
                'Too many keys. Specify only one data type per nesting level',
              keyVal: [k, v],
            });
          }
          break;
        case 'bytes':
          if (typeof v !== 'string' || !isHex(v)) {
            writer = [
              {
                error: 'Bytes must be a hex string',
                keyVal: [k, v],
              },
            ];
          }
          if (Object.keys(obj).length > 1) {
            writer.push({
              error:
                'Too many keys. Specify only one data type per nesting level',
              keyVal: [k, v],
            });
          }
          break;
        default:
          writer.push({
            error:
              'Unknown key:\n     Must be one of:\n        - `constructor`\n        - `fields`\n        - `int`\n        - `string`\n        - `bytes`\n        - `list`',
            keyVal: [k, v],
          });
          break;
      }
    });
    try {
      jsonToPlutusHex(obj);
    } catch (error) {
      writer.push({ error: 'Could not parse plutus data' });
    }

    return writer;
  };

  const findNoWhitespace = (text: string, k: string, v: string | number) => {
    const concatString = `"${k}":${typeof v === 'string' ? `"${v}"` : v}`;

    let noWs = '';
    let end;
    let endCp;

    for (let i = 0; i < text.length; i++) {
      const currChar = text[i];
      if (currChar.trim() !== '') {
        // is space
        noWs = noWs.concat(currChar);
      }
      if (
        noWs.length >= concatString.length &&
        noWs.slice(noWs.length - concatString.length) === concatString
      ) {
        end = i;
        endCp = i;
        break;
      }
    }

    if (!end || !endCp) return undefined;

    // Now that we know where it ends, we need to start going back until
    // we find a semicolon
    let semiColonFound = false;
    let firstClosingFound = false;
    while (end--) {
      const char = text[end];

      if (char === ':') {
        semiColonFound = true;
      }
      if (char === '"' && semiColonFound && !firstClosingFound) {
        firstClosingFound = true;
        continue;
      }
      if (char === '"' && semiColonFound && firstClosingFound) {
        break;
      }
    }
    return [end, endCp + 1];
  };

  const handleChange = (code: string | undefined) => {
    try {
      if (code && editorRef.current && monacoRef.current) {
        const errors = detectErrors(code);
        const currMonaco = monacoRef.current;
        const currModel = editorRef.current.getModel();

        if (currModel === null) return;

        currMonaco.editor.setModelMarkers(currModel, 'test', []);

        if (errors.length) {
          const markers: editor.IMarkerData[] = [];
          for (const e of errors) {
            if (!e.keyVal) continue;

            const result = findNoWhitespace(code, e.keyVal[0], e.keyVal[1]);

            if (!result) continue;

            const [start, end] = result;

            const startPos = currModel.getPositionAt(start);
            const endPos = currModel.getPositionAt(end);
            markers.push({
              message: e.error,
              severity: 8,
              startColumn: startPos.column,
              endColumn: endPos.column,
              endLineNumber: endPos.lineNumber,
              startLineNumber: startPos.lineNumber,
            });
          }
          currMonaco.editor.setModelMarkers(currModel, 'test', markers);
        } else {
          handleValidParsing(JSON.parse(code));
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('parsing failed: ', error);
    }
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    // here is another way to get monaco instance
    // you can also store it in `useRef` for further usage
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  return (
    <>
      <DottedPrompt onClick={onOpen}>{title}</DottedPrompt>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />

        <ModalContent w={650}>
          <ModalHeader>
            Plutus data creator <br />{' '}
            <Text color="gray.500" fontSize={'sm'}>
              Write readable JSON that compiles to plutus data
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={'4'}>
            <Box
              as={Editor}
              language="json"
              height={400}
              width={500}
              backgroundColor={theme.colors.gray[200]}
              loading={
                <Center minH={400}>
                  <Spinner />
                </Center>
              }
              theme="vs-dark"
              options={editorOptions}
              onMount={handleEditorDidMount}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              onChange={handleChange}
            />
            <Box mt="3" display={'flex'} alignItems="center">
              <Text
                mr="3"
                whiteSpace="nowrap"
                fontWeight={'bold'}
                fontSize="sm"
              >
                Hash:{' '}
              </Text>
              <Input size={'sm'} disabled value={dataHash} variant="filled" />
            </Box>
          </ModalBody>
          <ModalFooter
            display={'flex'}
            alignItems="center"
            justifyContent={'center'}
          >
            <Button
              colorScheme={'green'}
              disabled={!dataHash}
              onClick={onClose}
            >
              Ready
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export { PlutusDataCreator };
