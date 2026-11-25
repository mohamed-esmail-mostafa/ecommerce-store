<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateReviewRequest;
use App\Services\ReviewService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function __construct(protected ReviewService $review_service) {}

    /**
     * Display the reviews management page.
     */
    public function reviews_page(Request $request): Response
    {
        $search = $request->input('search');
        $status = $request->input('status', 'all');
        $rating = $request->filled('rating') && $request->input('rating') !== 'all'
            ? (int) $request->input('rating')
            : null;
        $perPage = (int) $request->input('per_page', 10);

        return Inertia::render('reviews/index', [
            'reviews' => $this->review_service->GetAllReviews($search, $status, $rating, $perPage),
            'stats' => $this->review_service->GetReviewStats(),
            'filters' => [
                'search' => $search ?? '',
                'status' => $status,
                'rating' => $rating !== null ? (string) $rating : 'all',
            ],
        ]);
    }

    /**
     * Toggle a review's approval status.
     */
    public function toggle_approval(int $id): RedirectResponse
    {
        $this->review_service->ToggleApproval($id);

        return redirect()->back()->with('success', 'Review approval status updated.');
    }

    /**
     * Update an existing review.
     */
    public function update_review(UpdateReviewRequest $request, int $id): RedirectResponse
    {
        $this->review_service->UpdateReview($request, $id);

        return redirect()->back()->with('success', 'Review updated successfully.');
    }

    /**
     * Delete a review.
     */
    public function delete_review(int $id): RedirectResponse
    {
        $this->review_service->DeleteReview($id);

        return redirect()->back()->with('success', 'Review deleted successfully.');
    }
}
