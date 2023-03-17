#!/bin/bash

# Script que automaticamente actualiza el directorio Backend con la ultima 
# versión que hay en gitHub y actualiza las dependencias automaticamente.

# Estando en el root
rm -rf Backend; git clone https://github.com/UNIZAR-30226-2023-09/Backend.git

# Moverse a la carpeta Backend/src
cd Backend/src

# Una vez en src actualizamos las dependencias
npm install
