

# Plan: Update ElevenLabs Agent Credentials

## Overview

Update the project secrets with the new ElevenLabs agent configuration to enable the AI chat functionality.

## Secrets to Update

| Secret Name | New Value | Purpose |
|-------------|-----------|---------|
| `ELEVENLABS_AGENT_ID` | `agent_2901kg5kcs7neyvsfbgs775g47j5` | Identifies your configured ElevenLabs conversational agent |
| `ELEVENLABS_API_KEY` | `5c339a47...` (provided) | Authenticates API requests to ElevenLabs |

## Implementation

1. Update `ELEVENLABS_AGENT_ID` secret with the new agent ID
2. Update `ELEVENLABS_API_KEY` secret with the new API key
3. The edge function `elevenlabs-conversation-token` will automatically use these new values

## Expected Result

After updating the secrets:
- The chat widget will connect to your newly configured agent
- Maya (your TruMove AI assistant) will respond to user messages
- The infinite loading/typing indicator issue will be resolved

## No Code Changes Required

The existing code already references these secrets correctly in the edge function. Only the secret values need to be updated.

