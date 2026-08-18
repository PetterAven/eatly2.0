Eatly Eats es una plataforma web integral diseñada para transformar y agilizar la experiencia gastronómica dentro del campus de la Universidad Politécnica de Pachuca (UPP), permitiendo a la comunidad universitaria explorar menús digitales, realizar pedidos de comida en tiempo real y eliminar los largos tiempos de espera en los comercios del campus como la Cafetería Central UPP y The Potro Burger.
La plataforma ofrece un flujo intuitivo que abarca desde la autenticación flexible mediante registro tradicional o inicio de sesión simplificado con Google OAuth, hasta la navegación filtrada por categorías como alimentos, botanas y bebidas, la gestión interactiva de un carrito de compras en tiempo real, la simulación del proceso de pago y el seguimiento de pedidos junto con un sistema de valoraciones.
Para lograr este funcionamiento dinámico y seguro, el proyecto implementa una arquitectura moderna compuesta por Laravel en el backend encargándose de la seguridad, el enrutamiento y la administración de la base de datos MySQL, conectado de manera transparente con React y TypeScript en el frontend mediante Inertia.js para brindar la fluidez de una aplicación de una sola página (SPA), combinando todo con Tailwind CSS para un diseño visual completamente adaptable y Vite para la compilación optimizada de recursos.

Directory structure:
└── petteraven-eatly2.0/
    ├── README.md
    ├── artisan
    ├── components.json
    ├── composer.json
    ├── Dockerfile
    ├── eslint.config.js
    ├── package.json
    ├── phpunit.xml
    ├── render.yaml
    ├── tsconfig.json
    ├── vite.config.ts
    ├── .dockerignore
    ├── .editorconfig
    ├── .env.example
    ├── .prettierignore
    ├── .prettierrc
    ├── app/
    │   ├── Actions/
    │   │   └── Fortify/
    │   │       ├── CreateNewUser.php
    │   │       ├── PasswordValidationRules.php
    │   │       └── ResetUserPassword.php
    │   ├── Http/
    │   │   ├── Controllers/
    │   │   │   ├── BranchController.php
    │   │   │   ├── CartController.php
    │   │   │   ├── CartItemController.php
    │   │   │   ├── CategoryController.php
    │   │   │   ├── Controller.php
    │   │   │   ├── DashboardController.php
    │   │   │   ├── DeliveryController.php
    │   │   │   ├── HomeController.php
    │   │   │   ├── ImageController.php
    │   │   │   ├── ItemController.php
    │   │   │   ├── LevelController.php
    │   │   │   ├── LocationController.php
    │   │   │   ├── OrderController.php
    │   │   │   ├── OrderHistoryController.php
    │   │   │   ├── OrderItemController.php
    │   │   │   ├── PaymentController.php
    │   │   │   ├── PedidoController.php
    │   │   │   ├── RatingController.php
    │   │   │   ├── RestaurantController.php
    │   │   │   ├── VendorController.php
    │   │   │   ├── Auth/
    │   │   │   │   └── GoogleController.php
    │   │   │   └── Settings/
    │   │   │       ├── PasswordController.php
    │   │   │       ├── ProfileController.php
    │   │   │       └── TwoFactorAuthenticationController.php
    │   │   ├── Middleware/
    │   │   │   ├── AuthenticateWithSessionOrToken.php
    │   │   │   ├── CheckRole.php
    │   │   │   ├── HandleAppearance.php
    │   │   │   └── HandleInertiaRequests.php
    │   │   ├── Requests/
    │   │   │   └── Settings/
    │   │   │       ├── ProfileUpdateRequest.php
    │   │   │       └── TwoFactorAuthenticationRequest.php
    │   │   └── Responses/
    │   │       ├── TabTokenLoginResponse.php
    │   │       └── TabTokenRegisterResponse.php
    │   ├── Models/
    │   │   ├── Branch.php
    │   │   ├── Cart.php
    │   │   ├── CartItem.php
    │   │   ├── Category.php
    │   │   ├── Image.php
    │   │   ├── Item.php
    │   │   ├── Level.php
    │   │   ├── Location.php
    │   │   ├── Order.php
    │   │   ├── OrderItem.php
    │   │   ├── Payment.php
    │   │   ├── Pedido.php
    │   │   ├── Product.php
    │   │   ├── Rating.php
    │   │   ├── Restaurant.php
    │   │   └── User.php
    │   └── Providers/
    │       ├── AppServiceProvider.php
    │       └── FortifyServiceProvider.php
    ├── bootstrap/
    │   ├── app.php
    │   └── providers.php
    ├── config/
    │   ├── app.php
    │   ├── auth.php
    │   ├── cache.php
    │   ├── database.php
    │   ├── filesystems.php
    │   ├── fortify.php
    │   ├── inertia.php
    │   ├── logging.php
    │   ├── mail.php
    │   ├── queue.php
    │   ├── sanctum.php
    │   ├── services.php
    │   └── session.php
    ├── database/
    │   ├── factories/
    │   │   ├── BranchFactory.php
    │   │   ├── CartFactory.php
    │   │   ├── CartItemFactory.php
    │   │   ├── CategoryFactory.php
    │   │   ├── ImageFactory.php
    │   │   ├── ItemFactory.php
    │   │   ├── LevelFactory.php
    │   │   ├── LocationFactory.php
    │   │   ├── OrderFactory.php
    │   │   ├── OrderItemFactory.php
    │   │   ├── PaymentFactory.php
    │   │   ├── RestaurantFactory.php
    │   │   └── UserFactory.php
    │   ├── migrations/
    │   │   ├── 0000_11_17_162215_create_levels_table.php
    │   │   ├── 0001_01_01_000000_create_users_table.php
    │   │   ├── 0001_01_01_000001_create_cache_table.php
    │   │   ├── 0001_01_01_000002_create_jobs_table.php
    │   │   ├── 2025_08_26_100418_add_two_factor_columns_to_users_table.php
    │   │   ├── 2025_11_17_161920_create_locations_table.php
    │   │   ├── 2025_11_17_162427_create_restaurants_table.php
    │   │   ├── 2025_11_17_162456_create_branches_table.php
    │   │   ├── 2025_11_17_162539_create_categories_table.php
    │   │   ├── 2025_11_17_162607_create_items_table.php
    │   │   ├── 2025_11_17_162630_create_carts_table.php
    │   │   ├── 2025_11_17_162702_create_cart_items_table.php
    │   │   ├── 2025_11_17_162819_create_orders_table.php
    │   │   ├── 2025_11_17_163002_create_order_items_table.php
    │   │   ├── 2025_11_17_163022_create_payments_table.php
    │   │   ├── 2025_11_17_163030_create_images_table.php
    │   │   ├── 2026_07_18_021602_add_collaborative_fields_to_users_table.php
    │   │   ├── 2026_07_18_021951_create_pedidos_table.php
    │   │   ├── 2026_07_18_030001_add_driver_id_to_pedidos_table.php
    │   │   ├── 2026_07_18_030002_create_ratings_table.php
    │   │   ├── 2026_07_18_040001_add_role_to_users_table.php
    │   │   ├── 2026_07_18_050001_add_location_to_restaurants_table.php
    │   │   ├── 2026_07_18_060001_add_schedule_and_image_to_restaurants_table.php
    │   │   ├── 2026_07_24_184028_add_google_fields_to_users_table.php
    │   │   ├── 2026_08_02_000000_add_soft_deletes_to_users_table.php
    │   │   ├── 2026_08_02_163205_add_google_fields_to_users_table.php
    │   │   ├── 2026_08_02_170000_add_sale_unit_to_items_table.php
    │   │   ├── 2026_08_08_170147_create_personal_access_tokens_table.php
    │   │   └── 2026_08_08_211000_add_delivery_location_to_orders_table.php
    │   └── seeders/
    │       ├── DatabaseSeeder.php
    │       ├── EatlyCampusSeeder.php
    │       ├── LevelSeeder.php
    │       └── UserRoleSeeder.php
    ├── lang/
    │   └── es/
    │       └── validation.php
    ├── public/
    │   ├── index.php
    │   ├── robots.txt
    │   └── .htaccess
    ├── resources/
    │   ├── css/
    │   │   └── app.css
    │   ├── js/
    │   │   ├── app.tsx
    │   │   ├── ssr.tsx
    │   │   ├── components/
    │   │   │   ├── alert-error.tsx
    │   │   │   ├── app-content.tsx
    │   │   │   ├── app-header.tsx
    │   │   │   ├── app-logo-icon.tsx
    │   │   │   ├── app-logo.tsx
    │   │   │   ├── app-shell.tsx
    │   │   │   ├── app-sidebar-header.tsx
    │   │   │   ├── app-sidebar.tsx
    │   │   │   ├── appearance-dropdown.tsx
    │   │   │   ├── appearance-tabs.tsx
    │   │   │   ├── breadcrumbs.tsx
    │   │   │   ├── delete-user.tsx
    │   │   │   ├── google-icon.tsx
    │   │   │   ├── heading-small.tsx
    │   │   │   ├── heading.tsx
    │   │   │   ├── icon.tsx
    │   │   │   ├── ImageUploadPreview.tsx
    │   │   │   ├── input-error.tsx
    │   │   │   ├── nav-footer.tsx
    │   │   │   ├── nav-main.tsx
    │   │   │   ├── nav-user.tsx
    │   │   │   ├── RatingModal.tsx
    │   │   │   ├── RestaurantMapPicker.tsx
    │   │   │   ├── Sidebar.tsx
    │   │   │   ├── StarRating.tsx
    │   │   │   ├── text-link.tsx
    │   │   │   ├── two-factor-recovery-codes.tsx
    │   │   │   ├── two-factor-setup-modal.tsx
    │   │   │   ├── user-info.tsx
    │   │   │   ├── user-menu-content.tsx
    │   │   │   └── ui/
    │   │   │       ├── alert.tsx
    │   │   │       ├── avatar.tsx
    │   │   │       ├── badge.tsx
    │   │   │       ├── breadcrumb.tsx
    │   │   │       ├── button.tsx
    │   │   │       ├── card.tsx
    │   │   │       ├── checkbox.tsx
    │   │   │       ├── collapsible.tsx
    │   │   │       ├── dialog.tsx
    │   │   │       ├── dropdown-menu.tsx
    │   │   │       ├── icon.tsx
    │   │   │       ├── input-otp.tsx
    │   │   │       ├── input.tsx
    │   │   │       ├── label.tsx
    │   │   │       ├── navigation-menu.tsx
    │   │   │       ├── placeholder-pattern.tsx
    │   │   │       ├── select.tsx
    │   │   │       ├── separator.tsx
    │   │   │       ├── sheet.tsx
    │   │   │       ├── sidebar.tsx
    │   │   │       ├── skeleton.tsx
    │   │   │       ├── spinner.tsx
    │   │   │       ├── toggle-group.tsx
    │   │   │       ├── toggle.tsx
    │   │   │       └── tooltip.tsx
    │   │   ├── hooks/
    │   │   │   ├── use-appearance.tsx
    │   │   │   ├── use-clipboard.ts
    │   │   │   ├── use-initials.tsx
    │   │   │   ├── use-mobile-navigation.ts
    │   │   │   ├── use-mobile.tsx
    │   │   │   └── use-two-factor-auth.ts
    │   │   ├── layouts/
    │   │   │   ├── app-layout.tsx
    │   │   │   ├── auth-layout.tsx
    │   │   │   ├── app/
    │   │   │   │   ├── app-header-layout.tsx
    │   │   │   │   └── app-sidebar-layout.tsx
    │   │   │   ├── auth/
    │   │   │   │   ├── auth-card-layout.tsx
    │   │   │   │   ├── auth-simple-layout.tsx
    │   │   │   │   └── auth-split-layout.tsx
    │   │   │   └── settings/
    │   │   │       ├── eatly-settings-layout.tsx
    │   │   │       └── layout.tsx
    │   │   ├── lib/
    │   │   │   ├── tab-auth.ts
    │   │   │   └── utils.ts
    │   │   ├── pages/
    │   │   │   ├── Dashboard.tsx
    │   │   │   ├── Welcome.tsx
    │   │   │   ├── auth/
    │   │   │   │   ├── confirm-password.tsx
    │   │   │   │   ├── forgot-password.tsx
    │   │   │   │   ├── login.tsx
    │   │   │   │   ├── register.tsx
    │   │   │   │   ├── reset-password.tsx
    │   │   │   │   ├── two-factor-challenge.tsx
    │   │   │   │   └── verify-email.tsx
    │   │   │   ├── Checkout/
    │   │   │   │   └── CheckoutForm.tsx
    │   │   │   ├── Delivery/
    │   │   │   │   └── Dashboard.tsx
    │   │   │   ├── Orders/
    │   │   │   │   └── History.tsx
    │   │   │   ├── settings/
    │   │   │   │   ├── appearance.tsx
    │   │   │   │   ├── password.tsx
    │   │   │   │   ├── profile.tsx
    │   │   │   │   └── two-factor.tsx
    │   │   │   └── Vendor/
    │   │   │       ├── Dashboard.tsx
    │   │   │       ├── Profile.tsx
    │   │   │       └── Register.tsx
    │   │   └── types/
    │   │       ├── index.d.ts
    │   │       └── vite-env.d.ts
    │   └── views/
    │       └── app.blade.php
    ├── routes/
    │   ├── console.php
    │   ├── settings.php
    │   └── web.php
    ├── tests/
    │   ├── TestCase.php
    │   ├── Feature/
    │   │   ├── DashboardTest.php
    │   │   ├── SessionOrTokenAuthenticationTest.php
    │   │   ├── UserRoleResolutionTest.php
    │   │   ├── Auth/
    │   │   │   ├── AuthenticationTest.php
    │   │   │   ├── EmailVerificationTest.php
    │   │   │   ├── PasswordConfirmationTest.php
    │   │   │   ├── PasswordResetTest.php
    │   │   │   ├── RegistrationTest.php
    │   │   │   ├── TwoFactorChallengeTest.php
    │   │   │   └── VerificationNotificationTest.php
    │   │   └── Settings/
    │   │       ├── PasswordUpdateTest.php
    │   │       ├── ProfileUpdateTest.php
    │   │       └── TwoFactorAuthenticationTest.php
    │   └── Unit/
    │       └── ExampleTest.php
    └── .github/
        └── workflows/
            ├── lint.yml
            └── tests.yml
