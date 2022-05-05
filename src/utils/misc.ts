import moment from 'moment';

export function formatDuration(period: number) {
  const parts = [];
  const duration = moment.duration(period);

  // return nothing when the duration is falsy or not correctly parsed (P0D)
  if (!duration || duration.toISOString() === 'P0D') return;

  if (duration.years() >= 1) {
    const years = Math.floor(duration.years());
    parts.push(years + ' ' + (years > 1 ? 'years' : 'year'));
  }

  if (duration.months() >= 1) {
    const months = Math.floor(duration.months());
    parts.push(months + ' ' + (months > 1 ? 'months' : 'month'));
  }

  if (duration.days() >= 1) {
    const days = Math.floor(duration.days());
    parts.push(days + ' ' + (days > 1 ? 'days' : 'day'));
  }

  if (duration.hours() >= 1) {
    const hours = Math.floor(duration.hours());
    parts.push(hours + ' ' + (hours > 1 ? 'h' : 'h'));
  }

  if (duration.minutes() >= 1) {
    const minutes = Math.floor(duration.minutes());
    parts.push(minutes + ' ' + (minutes > 1 ? 'm' : 'm'));
  }

  if (duration.seconds() >= 1) {
    const seconds = Math.floor(duration.seconds());
    parts.push(seconds + ' ' + (seconds > 1 ? 's' : 's'));
  }

  return 'in ' + parts.join(', ');
}
