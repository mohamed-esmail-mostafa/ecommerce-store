<?php

namespace App\Services;

use App\Http\Requests\UpdateReviewRequest;
use App\Models\Review;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ReviewService
{
    /**
     * Get paginated reviews with product and user relationships, supports search and filtering.
     *
     * @return LengthAwarePaginator<Review>
     */
    public function GetAllReviews(
        ?string $search = null,
        ?string $status = null,
        ?int $rating = null,
        int $perPage = 10
    ): LengthAwarePaginator {
        return Review::query()
            ->with([
                'product' => fn ($q) => $q->select('id', 'title', 'slug', 'price', 'sale_price')->with('images'),
                'user' => fn ($q) => $q->select('id', 'name', 'email', 'avatar'),
            ])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('comment', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($uq) => $uq->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"))
                        ->orWhereHas('product', fn ($pq) => $pq->where('title', 'like', "%{$search}%"));
                });
            })
            ->when($status !== null && $status !== 'all', function ($query) use ($status) {
                if ($status === 'approved') {
                    $query->where('is_approved', true);
                } elseif ($status === 'pending') {
                    $query->where('is_approved', false);
                }
            })
            ->when($rating !== null, function ($query) use ($rating) {
                $query->where('rating', $rating);
            })
            ->latest('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * Calculate summary metrics for reviews.
     *
     * @return array<string, mixed>
     */
    public function GetReviewStats(): array
    {
        $total = Review::count();
        $avgRating = $total > 0 ? (float) round(Review::avg('rating'), 1) : 0.0;
        $approvedCount = Review::where('is_approved', true)->count();
        $pendingCount = Review::where('is_approved', false)->count();

        $ratingBreakdown = [
            5 => Review::where('rating', 5)->count(),
            4 => Review::where('rating', 4)->count(),
            3 => Review::where('rating', 3)->count(),
            2 => Review::where('rating', 2)->count(),
            1 => Review::where('rating', 1)->count(),
        ];

        return [
            'total' => $total,
            'average_rating' => $avgRating,
            'approved_count' => $approvedCount,
            'pending_count' => $pendingCount,
            'rating_breakdown' => $ratingBreakdown,
        ];
    }

    /**
     * Find a review by its ID.
     */
    public function FindReviewById(int $id): Review
    {
        return Review::with([
            'product' => fn ($q) => $q->with('images'),
            'user',
        ])->findOrFail($id);
    }

    /**
     * Toggle the approved status of a review.
     */
    public function ToggleApproval(int $id): Review
    {
        $review = $this->FindReviewById($id);
        $review->is_approved = ! $review->is_approved;
        $review->save();

        return $review;
    }

    /**
     * Update an existing review.
     */
    public function UpdateReview(UpdateReviewRequest $request, int $id): Review
    {
        $review = $this->FindReviewById($id);

        $data = [
            'rating' => (int) $request->input('rating'),
            'title' => $request->input('title'),
            'comment' => $request->input('comment'),
        ];

        if ($request->has('is_approved')) {
            $data['is_approved'] = $request->boolean('is_approved');
        }

        $review->update($data);

        return $review->fresh(['product.images', 'user']);
    }

    /**
     * Delete a review.
     */
    public function DeleteReview(int $id): bool
    {
        $review = $this->FindReviewById($id);

        return (bool) $review->delete();
    }
}
