variable "GCP_CREDS" {
  type = string
}

variable gke_num_nodes {
  type = number
}

variable region {
  type = string 
}

variable zone {
  type = string 
}

variable project_id {
  type = string 
}

provider "google" {
  project = var.project_id 
  region  = var.region 
  zone    = var.zone 
  credentials = var.GCP_CREDS
}

resource "google_compute_network" "vpc_network" {
  name = "main-explorer-network" 
  auto_create_subnetworks = true
}

resource "google_container_cluster" "primary" {
  name = "cardano-explorer-primary" 
  remove_default_node_pool = true
  initial_node_count = 1

  network = google_compute_network.vpc_network.name
}

resource "google_container_node_pool" "primary_nodes" {
  name       = "${google_container_cluster.primary.name}-node-pool"
  cluster    = google_container_cluster.primary.name
  location   = var.region
  node_count = var.gke_num_nodes

  node_config {
    oauth_scopes = [
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ]

    labels = {
      env = var.project_id
    }

    machine_type = "n1-standard-1"
    tags         = ["gke-node", "${var.project_id}-gke"]
    metadata = {
      disable-legacy-endpoints = "true"
    }
  }
}

data "google_client_config" "provider" {}

provider "kubernetes" {
  host  = "https://${data.google_container_cluster.primary.endpoint}"
  token = data.google_client_config.provider.access_token
  cluster_ca_certificate = base64decode(
    data.google_container_cluster.my_cluster.master_auth[0].cluster_ca_certificate,
  )
}
