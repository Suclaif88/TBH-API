variable "NODE_ENV" {
  description = "El entorno de Node.js (ej. production, development)"
  type        = string
}

variable "APP_NAME" {
  description = "Nombre de la API"
  type        = string
}

variable "APP_VERSION" {
  description = "La versión de la aplicación"
  type        = string
}

variable "AUTOR" {
  description = "El autor de la aplicación"
  type        = string
}

variable "APP_URL" {
  description = "La URL de la aplicación"
  type        = string
}

variable "JWT_SECRET" {
  description = "El secreto para JWT"
  type        = string
  sensitive   = true
}

variable "MYSQL_ADDON_URI" {
  description = "URL de conexión a la base de datos MySQL"
  type        = string
  sensitive   = true
}

variable "CLOUDINARY_CLOUD_NAME" {
  description = "El nombre de tu cloud en Cloudinary"
  type        = string
}

variable "CLOUDINARY_API_KEY" {
  description = "API Key para Cloudinary"
  type        = string
  sensitive   = true
}

variable "CLOUDINARY_API_SECRET" {
  description = "API Secret para Cloudinary"
  type        = string
  sensitive   = true
}

variable "SERVICE_ID" {
  description = "ID del servicio Railway"
  type        = string
}

variable "ENVIRONMENT_ID" {
  description = "ID del entorno Railway"
  type        = string
}