#!/bin/bash
rsync -av --exclude='.git' --exclude='node_modules' --exclude='.env' . /google/data/rw/users/rv/rviscomi/www/spike-test/
