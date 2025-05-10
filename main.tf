terraform {
  required_providers {
    railway = {
      source  = "terraform-community-providers/railway"
      version = "0.4.6"
    }
  }
}

provider "railway" {
}

resource "railway_variable" "app_url" {
  service_id     = var.service_id
  environment_id = var.environment_id
  name           = "APP_URL"
  value          = var.app_url
}

resource "railway_variable" "jwt_secret" {
  service_id     = var.service_id
  environment_id = var.environment_id
  name           = "JWT_SECRET"
  value          = var.jwt_secret
}

resource "railway_variable" "autor" {
  service_id     = var.service_id
  environment_id = var.environment_id
  name           = "AUTOR"
  value          = var.autor
}

resource "railway_variable" "version" {
  service_id     = var.service_id
  environment_id = var.environment_id
  name           = "VERSION"
  value          = var.app_version
}

resource "railway_variable" "cloudinary_cloud_name" {
  service_id     = var.service_id
  environment_id = var.environment_id
  name           = "CLOUDINARY_CLOUD_NAME"
  value          = var.cloudinary_cloud_name
}

resource "railway_variable" "cloudinary_api_key" {
  service_id     = var.service_id
  environment_id = var.environment_id
  name           = "CLOUDINARY_API_KEY"
  value          = var.cloudinary_api_key
}

resource "railway_variable" "cloudinary_api_secret" {
  service_id     = var.service_id
  environment_id = var.environment_id
  name           = "CLOUDINARY_API_SECRET"
  value          = var.cloudinary_api_secret
}

resource "railway_variable" "node_env" {
  service_id     = var.service_id
  environment_id = var.environment_id
  name           = "NODE_ENV"
  value          = var.node_env
}

resource "railway_variable" "database_url" {
  service_id     = var.service_id
  environment_id = var.environment_id
  name           = "DATABASE_URL"
  value          = var.database_url
}
