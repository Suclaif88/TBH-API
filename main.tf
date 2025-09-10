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

resource "railway_variable" "NODE_ENV" {
  service_id     = var.SERVICE_ID
  environment_id = var.ENVIRONMENT_ID
  name           = "NODE_ENV"
  value          = var.NODE_ENV
}

resource "railway_variable" "APP_NAME" {
  service_id     = var.SERVICE_ID
  environment_id = var.ENVIRONMENT_ID
  name           = "APP_NAME"
  value          = var.APP_NAME
}

resource "railway_variable" "VERSION" {
  service_id     = var.SERVICE_ID
  environment_id = var.ENVIRONMENT_ID
  name           = "APP_VERSION"
  value          = var.APP_VERSION
}

resource "railway_variable" "AUTOR" {
  service_id     = var.SERVICE_ID
  environment_id = var.ENVIRONMENT_ID
  name           = "AUTOR"
  value          = var.AUTOR
}

resource "railway_variable" "APP_URL" {
  service_id     = var.SERVICE_ID
  environment_id = var.ENVIRONMENT_ID
  name           = "APP_URL"
  value          = var.APP_URL
}

resource "railway_variable" "JWT_SECRET" {
  service_id     = var.SERVICE_ID
  environment_id = var.ENVIRONMENT_ID
  name           = "JWT_SECRET"
  value          = var.JWT_SECRET
}

resource "railway_variable" "MYSQL_ADDON_URI" {
  service_id     = var.SERVICE_ID
  environment_id = var.ENVIRONMENT_ID
  name           = "MYSQL_ADDON_URI"
  value          = var.MYSQL_ADDON_URI
}

resource "railway_variable" "CLOUDINARY_CLOUD_NAME" {
  service_id     = var.SERVICE_ID
  environment_id = var.ENVIRONMENT_ID
  name           = "CLOUDINARY_CLOUD_NAME"
  value          = var.CLOUDINARY_CLOUD_NAME
}

resource "railway_variable" "CLOUDINARY_API_KEY" {
  service_id     = var.SERVICE_ID
  environment_id = var.ENVIRONMENT_ID
  name           = "CLOUDINARY_API_KEY"
  value          = var.CLOUDINARY_API_KEY
}

resource "railway_variable" "CLOUDINARY_API_SECRET" {
  service_id     = var.SERVICE_ID
  environment_id = var.ENVIRONMENT_ID
  name           = "CLOUDINARY_API_SECRET"
  value          = var.CLOUDINARY_API_SECRET
}