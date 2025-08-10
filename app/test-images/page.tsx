'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function TestImagesPage() {
  const [imageStatus, setImageStatus] = useState<Record<string, 'loading' | 'loaded' | 'error'>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize all images as loading
    const initialStatus: Record<string, 'loading' | 'loaded' | 'error'> = {};
    for (let i = 1; i <= 205; i++) {
      initialStatus[`${i}.png`] = 'loading';
    }
    setImageStatus(initialStatus);
    setLoading(false);
  }, []);

  const handleImageLoad = (imageName: string) => {
    setImageStatus(prev => ({ ...prev, [imageName]: 'loaded' }));
  };

  const handleImageError = (imageName: string) => {
    setImageStatus(prev => ({ ...prev, [imageName]: 'error' }));
  };

  const loadedCount = Object.values(imageStatus).filter(status => status === 'loaded').length;
  const errorCount = Object.values(imageStatus).filter(status => status === 'error').length;
  const loadingCount = Object.values(imageStatus).filter(status => status === 'loading').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Tracksuit Images Test</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Loaded</p>
                  <p className="text-2xl font-bold text-green-600">{loadedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Errors</p>
                  <p className="text-2xl font-bold text-red-600">{errorCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Loading</p>
                  <p className="text-2xl font-bold text-blue-600">{loadingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {Array.from({ length: 205 }, (_, i) => i + 1).map((num) => {
            const imageName = `${num}.png`;
            const status = imageStatus[imageName];
            
            return (
              <Card key={num} className="overflow-hidden">
                <div className="aspect-square bg-gray-100 relative">
                  <img
                    src={`/images/${imageName}`}
                    alt={`Tracksuit ${num}`}
                    className="w-full h-full object-cover"
                    onLoad={() => handleImageLoad(imageName)}
                    onError={() => handleImageError(imageName)}
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-1 right-1">
                    {status === 'loaded' && (
                      <Badge className="bg-green-600 text-white text-xs">✓</Badge>
                    )}
                    {status === 'error' && (
                      <Badge className="bg-red-600 text-white text-xs">✗</Badge>
                    )}
                    {status === 'loading' && (
                      <Badge className="bg-blue-600 text-white text-xs">⋯</Badge>
                    )}
                  </div>
                  
                  {/* Image Number */}
                  <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                    {num}
                  </div>
                </div>
                <CardContent className="p-2">
                  <p className="text-xs text-center font-medium">#{num}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {errorCount > 0 && (
        <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="font-semibold text-red-800 mb-2">Images with Errors:</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(imageStatus)
              .filter(([_, status]) => status === 'error')
              .map(([imageName]) => (
                <Badge key={imageName} variant="destructive" className="text-xs">
                  {imageName}
                </Badge>
              ))}
          </div>
        </div>
      )}
    </div>
  );
} 
