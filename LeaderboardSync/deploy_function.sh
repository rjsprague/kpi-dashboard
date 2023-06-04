#!/bin/bash

gcloud functions deploy sync_reia_leaderboard --runtime python310 --trigger-http --allow-unauthenticated --project access-spreadsheets-388622
