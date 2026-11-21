<?php

namespace App\Services;

use App\Http\Requests\StoreBannerRequest;
use App\Http\Requests\UpdateBannerRequest;
use App\Models\Banner;
use Illuminate\Database\Eloquent\Collection;

class BannerService
{
    /**
     * Create a new class instance.
     */
    public function __construct(protected CloudinaryService $cloudinary_service) {}

    /**
     * Get all banners ordered by creation date.
     *
     * @return Collection<int, Banner>
     */
    public function GetAll(): Collection
    {
        return Banner::latest()->get();
    }

    /**
     * Get banner by id.
     */
    public function GetById(int $id): Banner
    {
        return Banner::findOrFail($id);
    }

    /**
     * Store a new banner.
     */
    public function Store(StoreBannerRequest $request): Banner
    {
        $banner = new Banner;
        $banner->title = $request->input('title');
        $banner->description = $request->input('description');
        $banner->type = $request->input('type', 'slider');
        $banner->link = $request->input('link');
        $banner->button_text = $request->input('button_text');
        $banner->is_active = filter_var($request->input('is_active', true), FILTER_VALIDATE_BOOLEAN);

        // Upload desktop image
        if ($request->hasFile('image')) {
            $upload = $this->cloudinary_service->uploadToCloudinary($request->file('image'), 'banners');
            if ($upload) {
                $banner->image = $upload['url'] ?? null;
                $banner->public_id = $upload['public_id'] ?? null;
            }
        } elseif (is_string($request->input('image'))) {
            $banner->image = $request->input('image');
        }

        // Upload mobile image
        if ($request->hasFile('mobile_image')) {
            $uploadMobile = $this->cloudinary_service->uploadToCloudinary($request->file('mobile_image'), 'banners');
            if ($uploadMobile) {
                $banner->mobile_image = $uploadMobile['url'] ?? null;
                $banner->public_mobile_id = $uploadMobile['public_id'] ?? null;
            }
        } elseif (is_string($request->input('mobile_image'))) {
            $banner->mobile_image = $request->input('mobile_image');
        }

        $banner->save();

        return $banner;
    }

    /**
     * Update an existing banner.
     */
    public function Update(UpdateBannerRequest $request, Banner $banner): Banner
    {
        $banner->title = $request->input('title');
        $banner->description = $request->input('description');
        $banner->type = $request->input('type', $banner->type);
        $banner->link = $request->input('link');
        $banner->button_text = $request->input('button_text');

        if ($request->has('is_active')) {
            $banner->is_active = filter_var($request->input('is_active'), FILTER_VALIDATE_BOOLEAN);
        }

        // Handle desktop image
        if ($request->hasFile('image')) {
            $this->cloudinary_service->deleteFromCloudinary($banner->public_id);
            $upload = $this->cloudinary_service->uploadToCloudinary($request->file('image'), 'banners');
            if ($upload) {
                $banner->image = $upload['url'] ?? null;
                $banner->public_id = $upload['public_id'] ?? null;
            }
        } elseif ($request->exists('image') && empty($request->input('image'))) {
            $this->cloudinary_service->deleteFromCloudinary($banner->public_id);
            $banner->image = null;
            $banner->public_id = null;
        }

        // Handle mobile image
        if ($request->hasFile('mobile_image')) {
            $this->cloudinary_service->deleteFromCloudinary($banner->public_mobile_id);
            $uploadMobile = $this->cloudinary_service->uploadToCloudinary($request->file('mobile_image'), 'banners');
            if ($uploadMobile) {
                $banner->mobile_image = $uploadMobile['url'] ?? null;
                $banner->public_mobile_id = $uploadMobile['public_id'] ?? null;
            }
        } elseif ($request->exists('mobile_image') && empty($request->input('mobile_image'))) {
            $this->cloudinary_service->deleteFromCloudinary($banner->public_mobile_id);
            $banner->mobile_image = null;
            $banner->public_mobile_id = null;
        }

        $banner->save();

        return $banner;
    }

    /**
     * Delete a banner and its associated Cloudinary images.
     */
    public function Delete(Banner $banner): bool
    {
        $this->cloudinary_service->deleteFromCloudinary($banner->public_id);
        $this->cloudinary_service->deleteFromCloudinary($banner->public_mobile_id);

        return (bool) $banner->delete();
    }

    /**
     * Toggle active status.
     */
    public function ToggleStatus(Banner $banner): Banner
    {
        $banner->is_active = ! $banner->is_active;
        $banner->save();

        return $banner;
    }

    public function getAllSiders()
    {
        return Banner::where('type', 'slider')->get();
    }
}
