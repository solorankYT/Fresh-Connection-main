<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\App;
use App\Http\Middleware\RoleMiddleware;
use App\Http\Controllers\MfaController;
use Inertia\Inertia;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\TrackingController;
use App\Http\Controllers\Admin\LoginController;
use App\Http\Controllers\ManageOrderController;
use App\Http\Controllers\ManageProductsController;
use App\Http\Controllers\SidebarController;
use App\Http\Controllers\ProductReviewController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\UserManagementController;
use App\Http\Controllers\VoucherController;
use App\Http\Controllers\Admin\VoucherManagementController;
use App\Http\Middleware\EnsureCartIsNotEmpty;

// Register middleware alias
Route::aliasMiddleware('role', RoleMiddleware::class);
Route::aliasMiddleware('verify.mfa', \App\Http\Middleware\VerifyMfa::class);
Route::aliasMiddleware('prevent.mfa.refresh', \App\Http\Middleware\PreventMfaRefresh::class);

// MFA Routes - These should not have verify.mfa middleware
Route::middleware(['auth', 'prevent.mfa.refresh'])->group(function () {
    Route::get('/verify-mfa', [MfaController::class, 'showVerification'])->name('verify-mfa');
    Route::post('/verify-mfa', [MfaController::class, 'verify'])->name('verify-mfa.verify');
    Route::post('/verify-mfa/send', [MfaController::class, 'sendVerificationCode'])->name('verify-mfa.send');
});

// Protected Routes (require MFA verification)
Route::middleware(['auth', 'verify.mfa'])->group(function () {
    // Cart and Order Routes
    Route::post('/orders/{order}/buy-again', [CartController::class, 'buyAgain'])->name('orders.buy-again');
    Route::post('/cart/apply-promo', [CartController::class, 'applyPromo'])->name('cart.apply-promo');
    Route::post('/cart/remove-promo', [CartController::class, 'removePromo'])->name('cart.remove-promo');
    
    // Add all your protected routes here
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
});

// Public Routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/products', [ProductController::class, 'index'])->name('products');
Route::get('/item/{product}', [ItemController::class, 'show'])->name('item.show');
// Review Routes
Route::get('/reviews/{product_id}', [ReviewController::class, 'index']);
Route::middleware(['auth'])->group(function () {
    Route::get('/reviews/{review}/edit', [ReviewController::class, 'edit'])->name('reviews.edit');
    Route::put('/reviews/{review}', [ReviewController::class, 'update'])->name('reviews.update');
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');
});
Route::get('/about', fn() => Inertia::render('About'))->name('about');
Route::get('/contact', fn() => Inertia::render('Contact'))->name('contact');
Route::get('/search', [ItemController::class, 'search'])->name('search');

// Authentication Routes
Route::middleware('guest')->group(function () {
    Route::get('/login', fn() => Inertia::render('Login'))->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store']);
    Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store']);

    // Two-Factor Authentication
    Route::get('/two-factor-challenge', [AuthenticatedSessionController::class, 'twoFactorChallenge'])
        ->name('two-factor.challenge');
    Route::post('/two-factor-challenge', [AuthenticatedSessionController::class, 'twoFactorVerify'])
        ->name('two-factor.verify');
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->middleware('auth');

// Authenticated User Routes
Route::middleware(['auth'])->group(function () {
    // Cart Routes
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'store'])->name('cart.store');
    Route::delete('/cart/remove/{id}', [CartController::class, 'destroy'])->name('cart.destroy');
    Route::post('/cart/apply-promo', [CartController::class, 'applyPromo'])->name('cart.apply-promo');
    Route::post('/cart/remove-promo', [CartController::class, 'removePromo'])->name('cart.remove-promo');

    // Checkout Routes
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout/apply-promo', [CheckoutController::class, 'applyPromo'])->name('checkout.apply-promo');
    Route::post('/checkout/remove-promo', [CheckoutController::class, 'removePromo'])->name('checkout.remove-promo');
    
    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
    Route::get('/profile/login-history', [ProfileController::class, 'getLoginHistory'])
        ->name('profile.login-history');
    Route::get('/tracking', [TrackingController::class, 'index'])->name('tracking');


    // Sidebar Route
    Route::get('/sidebar/user-data', [SidebarController::class, 'getUserData'])->middleware('auth')->name('sidebar.user-data');

    // Product Review Routes
    Route::controller(ProductReviewController::class)->group(function () {
        Route::get('/product-reviews', 'index')->name('product-reviews.index');
        Route::post('/product-reviews', 'store')->name('product-reviews.store');
        Route::put('/product-reviews/{review}', 'update')->name('product-reviews.update');
        Route::delete('/product-reviews/{review}', 'destroy')->name('product-reviews.destroy');
    });

    // Voucher Routes
    Route::post('/vouchers/validate', [VoucherController::class, 'validate'])->name('vouchers.validate');
    Route::post('/vouchers/apply', [VoucherController::class, 'apply'])->name('vouchers.apply');

    // Two Factor Authentication routes
    Route::middleware(['redirect2fa'])->group(function () {
        Route::match(['get', 'post'], '/profile/2fa', [ProfileController::class, 'toggleTwoFactor'])
            ->name('profile.2fa');
        Route::match(['get', 'post'], '/profile/2fa/verify', [ProfileController::class, 'verify2FA'])
            ->name('profile.2fa.verify');
    });

      Route::post('/order/{orderId}/upload-proof', [TrackingController::class, 'uploadPaymentProof'])->name('order.uploadProof');
});

Route::middleware(['auth', EnsureCartIsNotEmpty::class])->group(function () {
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
});



// Admin Routes 
Route::middleware(['auth', 'role:admin'])->group(function () {

    Route::get('/admin/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/manage-products', [ManageProductsController::class, 'index'])->name('admin.manage-products');
    Route::put('/admin/manage-products/bulk-update', [ManageProductsController::class, 'bulkUpdate'])->name('admin.manage-products.bulk-update');
    Route::put('/admin/manage-products/{product_id}', [ManageProductsController::class, 'update'])->name('manage-products.update');
    Route::delete('/admin/manage-products/{product_id}', [ManageProductsController::class, 'destroy'])->name('manage-products.delete');
    Route::post('/admin/manage-products', [ManageProductsController::class, 'store']);

    Route::get('/admin/manage-orders', [ManageOrderController::class, 'index'])->name('admin.manage-orders');
    Route::post('/admin/manage-orders/bulk-update', [ManageOrderController::class, 'bulkUpdate'])->name('manage-orders.bulk-update');
    Route::delete('/admin/manage-orders/{id}', [ManageOrderController::class, 'destroy'])->name('manage-orders.destroy');
    Route::post('/admin/manage-orders/{order}/update-items', [ManageOrderController::class, 'updateOrderItems'])->name('manage-orders.update-items');
    Route::post('/admin/manage-orders/{orderId}/update-status', [ManageOrderController::class, 'updateOrderStatus']);

    Route::get('/admin/user-management', [UserManagementController::class, 'index'])->name('admin.user-management');
    Route::put('/admin/user-management/bulk-update', [UserManagementController::class, 'bulkUpdate'])->name('admin.user-management.bulk-update');

    // Promotion Management Routes
    Route::get('/admin/promotions', [PromotionController::class, 'index'])->name('admin.promotions');
    Route::post('/admin/promotions', [PromotionController::class, 'store'])->name('admin.promotions.store');

    // Voucher Management Routes
    Route::get('/admin/vouchers', [VoucherManagementController::class, 'index'])->name('admin.vouchers');
    Route::post('/admin/vouchers', [VoucherManagementController::class, 'store'])->name('admin.vouchers.store');
    Route::put('/admin/vouchers/{voucher}', [VoucherManagementController::class, 'update'])->name('admin.vouchers.update');
    Route::delete('/admin/vouchers/{voucher}', [VoucherManagementController::class, 'destroy'])->name('admin.vouchers.destroy');

    Route::post('/order/{orderId}/confirm', [ManageOrderController::class, 'confirmOrder'])->name('order.confirm');

});


