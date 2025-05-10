variable "service_id" {
  description = "ID del servicio Railway"
  type        = string
}

variable "environment_id" {
  description = "ID del entorno Railway"
  type        = string
}

variable "database_url" {
  description = "URL de conexión a la base de datos"
  type        = string
  sensitive   = true
}

variable "app_url" {
  description = "La URL de la aplicación"
  type        = string
}

variable "jwt_secret" {
  description = "El secreto para JWT"
  type        = string
  sensitive   = true
}

variable "autor" {
  description = "El autor de la aplicación"
  type        = string
}

variable "app_version" {
  description = "La versión de la aplicación"
  type        = string
}

variable "cloudinary_cloud_name" {
  description = "El nombre de tu cloud en Cloudinary"
  type        = string
}

variable "cloudinary_api_key" {
  description = "API Key para Cloudinary"
  type        = string
  sensitive   = true
}

variable "cloudinary_api_secret" {
  description = "API Secret para Cloudinary"
  type        = string
  sensitive   = true
}

variable "node_env" {
  description = "El entorno de Node.js (ej. production, development)"
  type        = string
}
