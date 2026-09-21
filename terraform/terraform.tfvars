location            = "Australia East"
resource_group_name = "koalatech-week10-rg"

# Replace with a unique name for your Azure Container Registry
acr_name = "koalatechacrjmwk10"

# Replace with a unique name for your Azure Kubernetes Service cluster
aks_cluster_name = "koalatechaksjmwk8"
aks_dns_prefix   = "koalatech"

aks_node_count   = 1
aks_node_vm_size = "Standard_D2s_v3"

environment = "development"

tags = {
  Project     = "KoalaTech Frontend"
  ManagedBy   = "Terraform"
  Practical   = "week10"
  Environment = "Development"
}
