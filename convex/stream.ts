import { query } from "./_generated/server";
import { v } from "convex/values";

const STREAM_API_SECRET = process.env.STREAM_API_SECRET!;

export const getToken = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Convert API secret to Uint8Array for Web Crypto
    const encoder = new TextEncoder();
    const keyData = encoder.encode(STREAM_API_SECRET);
    const messageData = encoder.encode(`${args.userId}${timestamp}`);
    
    // Import the key
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    // Sign the message
    const signature = await crypto.subtle.sign('HMAC', key, messageData);
    
    // Convert to hex
    const signatureHex = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    return `${timestamp}.${signatureHex}`;
  },
});