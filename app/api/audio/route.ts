export async function GET() {
  try {
    // Fetch the audio file from Jumpshare
    const response = await fetch('https://jumpshare.com/s/QlDFZG8ylx9ObSD7cniB/download', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch audio: ${response.statusText}`)
    }

    const buffer = await response.arrayBuffer()

    // Return with proper CORS headers and Content-Type
    return new Response(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('[v0] Audio proxy error:', error)
    return new Response('Failed to load audio', { status: 500 })
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
