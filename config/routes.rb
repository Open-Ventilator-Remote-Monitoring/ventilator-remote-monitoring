Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :ventilators
    end
  end

  # home#index will deliver the single page app bundle
  # So, any URLs that are in the app/javascript/routes
  # should all get home#index
  root 'home#index'
  get '/about' => 'home#index'
  get '/contribute' => 'home#index'
  get '/demo' => 'home#index'
  get '/' => 'home#index'
end
