output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.rg.name
}

output "acr_name" {
  description = "Name of the Azure Container Registry"
  value       = azurerm_container_registry.acr.name
}

output "acr_login_server" {
  description = "Login server of the Azure Container Registry"
  value       = azurerm_container_registry.acr.login_server
}

output "aks_cluster_name" {
  description = "Name of the AKS cluster"
  value       = azurerm_kubernetes_cluster.aks.name
}

output "aks_get_credentials_command" {
  description = "Azure CLI command used to configure kubectl"
  value = join(" ", [
    "az aks get-credentials",
    "--resource-group",
    azurerm_resource_group.rg.name,
    "--name",
    azurerm_kubernetes_cluster.aks.name,
    "--overwrite-existing"
  ])
}

output "acr_login_command" {
  description = "Azure CLI command used to log in to ACR"
  value       = "az acr login --name ${azurerm_container_registry.acr.name}"
}
