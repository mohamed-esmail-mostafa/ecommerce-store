<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreBannerRequest;
use App\Http\Requests\UpdateBannerRequest;
use App\Models\Banner;
use App\Services\BannerService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BannerController extends Controller
{
    public function __construct(protected BannerService $banner_service) {}

    /**
     * Display the banners list page.
     */
    public function bannersPage(): Response
    {
        return Inertia::render('banners/index', [
            'banners' => $this->banner_service->GetAll(),
        ]);
    }

    /**
     * Alias for bannersPage (handles backward-compatibility).
     */
    public function bannersPgae(): Response
    {
        return $this->bannersPage();
    }

    /**
     * Store a newly created banner.
     */
    public function storeBanner(StoreBannerRequest $request): RedirectResponse
    {
        $this->banner_service->Store($request);

        return redirect()->back();
    }

    /**
     * Update an existing banner.
     */
    public function updateBanner(UpdateBannerRequest $request, Banner $banner): RedirectResponse
    {
        $this->banner_service->Update($request, $banner);

        return redirect()->back();
    }

    /**
     * Delete an existing banner.
     */
    public function deleteBanner(Banner $banner): RedirectResponse
    {
        $this->banner_service->Delete($banner);

        return redirect()->back();
    }

    /**
     * Toggle active/inactive status.
     */
    public function toggleStatus(Banner $banner): RedirectResponse
    {
        $this->banner_service->ToggleStatus($banner);

        return redirect()->back();
    }
}
