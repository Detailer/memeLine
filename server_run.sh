#!/bin/bash

cd backend

# Setup DB or any other environment variables you want to setup.
echo "Installing npm dependencies"
npm install

echo "Starting Server"
npm start