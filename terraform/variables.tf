variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
  default     = "banking-rg"
}

variable "location" {
  description = "The Azure region"
  type        = string
  default     = "East US"
}

variable "cluster_name" {
  description = "The name of the AKS cluster"
  type        = string
  default     = "banking-aks-cluster"
}

variable "acr_name" {
  description = "ACR name"
  type        = string
  default     = "bankingacr123"
}
