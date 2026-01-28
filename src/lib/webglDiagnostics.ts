/**
 * WebGL Diagnostics Utility
 * Detects GPU capabilities and provides recommendations for map rendering
 */

export interface WebGLDiagnostics {
  supported: boolean;
  version: 'webgl' | 'webgl2' | null;
  renderer: string | null;
  vendor: string | null;
  maxTextureSize: number | null;
  unmaskedRenderer: string | null;
  unmaskedVendor: string | null;
  warnings: string[];
  recommendation: 'full' | 'static' | 'none';
  isSoftwareRendering: boolean;
}

let cachedDiagnostics: WebGLDiagnostics | null = null;

export function getWebGLDiagnostics(): WebGLDiagnostics {
  // Return cached result to avoid repeated checks
  if (cachedDiagnostics) return cachedDiagnostics;

  const canvas = document.createElement('canvas');
  const warnings: string[] = [];
  
  // Try WebGL2 first, then WebGL1
  let gl: WebGLRenderingContext | WebGL2RenderingContext | null = canvas.getContext('webgl2');
  let version: 'webgl' | 'webgl2' | null = gl ? 'webgl2' : null;
  
  if (!gl) {
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    version = gl ? 'webgl' : null;
  }
  
  if (!gl) {
    cachedDiagnostics = {
      supported: false,
      version: null,
      renderer: null,
      vendor: null,
      maxTextureSize: null,
      unmaskedRenderer: null,
      unmaskedVendor: null,
      warnings: ['WebGL is not available in your browser. Please enable hardware acceleration.'],
      recommendation: 'static',
      isSoftwareRendering: false
    };
    return cachedDiagnostics;
  }
  
  // Get debug info extension
  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  
  let unmaskedRenderer: string | null = null;
  let unmaskedVendor: string | null = null;
  
  if (debugInfo) {
    unmaskedRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    unmaskedVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
  }
  
  const renderer = gl.getParameter(gl.RENDERER);
  const vendor = gl.getParameter(gl.VENDOR);
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  
  // Detect software rendering
  const rendererLower = (unmaskedRenderer || renderer || '').toLowerCase();
  const isSoftwareRendering = 
    rendererLower.includes('swiftshader') ||
    rendererLower.includes('llvmpipe') ||
    rendererLower.includes('software') ||
    rendererLower.includes('microsoft basic render') ||
    rendererLower.includes('virtualbox');
  
  if (isSoftwareRendering) {
    warnings.push('Software rendering detected - 3D maps may be slow');
  }
  
  // Check for low texture size (underpowered GPU)
  if (maxTextureSize && maxTextureSize < 4096) {
    warnings.push('Limited GPU capabilities detected');
  }
  
  // Check for known problematic configurations
  if (rendererLower.includes('angle')) {
    // ANGLE is generally fine, but note it
    console.log('WebGL using ANGLE translation layer');
  }
  
  // Determine recommendation
  let recommendation: 'full' | 'static' | 'none' = 'full';
  
  if (!gl) {
    recommendation = 'static';
  } else if (isSoftwareRendering) {
    recommendation = 'static';
  } else if (warnings.length > 0) {
    // Has warnings but still has hardware acceleration
    recommendation = 'full';
  }
  
  cachedDiagnostics = {
    supported: true,
    version,
    renderer,
    vendor,
    maxTextureSize,
    unmaskedRenderer,
    unmaskedVendor,
    warnings,
    recommendation,
    isSoftwareRendering
  };
  
  return cachedDiagnostics;
}

/**
 * Quick check to determine if static map should be used
 */
export function shouldUseStaticMap(): boolean {
  const diagnostics = getWebGLDiagnostics();
  return !diagnostics.supported || diagnostics.recommendation === 'static';
}

/**
 * Clear cached diagnostics (useful for testing)
 */
export function clearDiagnosticsCache(): void {
  cachedDiagnostics = null;
}

/**
 * Get a user-friendly message about WebGL status
 */
export function getWebGLStatusMessage(): string {
  const diagnostics = getWebGLDiagnostics();
  
  if (!diagnostics.supported) {
    return 'WebGL is not available. Please enable hardware acceleration in your browser settings.';
  }
  
  if (diagnostics.isSoftwareRendering) {
    return 'Your browser is using software rendering. For best performance, enable hardware acceleration.';
  }
  
  if (diagnostics.warnings.length > 0) {
    return diagnostics.warnings[0];
  }
  
  return 'WebGL is working normally.';
}
