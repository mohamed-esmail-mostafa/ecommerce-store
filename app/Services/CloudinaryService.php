<?php

namespace App\Services;

use Cloudinary\Api\ApiUtils;
use Cloudinary\Cloudinary;
use Exception;
use Illuminate\Support\Facades\Log;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;
use Intervention\Image\Format;
use Intervention\Image\ImageManager;

class CloudinaryService
{
    private function cloudinary(): Cloudinary
    {
        return new Cloudinary([
            'cloud' => [
                'cloud_name' => config('services.cloudinary.cloud_name'),
                'api_key' => config('services.cloudinary.api_key'),
                'api_secret' => config('services.cloudinary.api_secret'),
            ],
        ]);
    }

    public function uploadToCloudinary($file, string $folder): ?array
    {
        $tempPath = null;

        try {
            $manager = ImageManager::usingDriver(
                GdDriver::class
            );

            $image = $manager->decodePath(
                $file->getRealPath()
            );

            $image->scale(
                width: 1200
            );

            $encoded = $image->encodeUsingFormat(
                Format::WEBP,
                quality: 80
            );

            $tempPath = storage_path(
                'app/temp_'.uniqid().'.webp'
            );

            $encoded->save($tempPath);

            $result = $this->cloudinary()->uploadApi()->upload(
                $tempPath,
                ['folder' => $folder]
            );

            return [
                'url' => $result['secure_url'],
                'public_id' => $result['public_id'],
            ];
        } catch (Exception $e) {
            Log::error('Cloudinary upload error: '.$e->getMessage());

            return null;
        } finally {
            if ($tempPath && file_exists($tempPath)) {
                @unlink($tempPath);
            }
        }
    }

    public function deleteFromCloudinary(?string $publicId): bool
    {
        if (! $publicId) {
            return false;
        }

        try {
            $this->cloudinary()->uploadApi()->destroy($publicId);

            return true;
        } catch (Exception $e) {
            Log::error('Cloudinary delete error: '.$e->getMessage());

            return false;
        }
    }

    public function uploadSignture()
    {
        $cloud = $this->cloudinary()->configuration->cloud;
        $timestamp = time();
        $params = [
            'timestamp' => $timestamp,
            'folder' => 'store-app',
        ];

        $signture = ApiUtils::signParameters($params, $cloud->apiSecret);

        return response()->json([
            ...$params,
            'signture' => $signture,
            'api_key' => $cloud->apiKey,
            'cloud_name' => $cloud->cloudName,
        ]);
    }
}
