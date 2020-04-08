Rails.application.routes.draw do

  resources :users
  resources :clusters
  resources :organizations
  resources :organizations do
    resources :clusters do
      resources :ventilators
    end
    end

  # will get all ventilators for the logged in user's organization
  # todo: determine what to do for super users
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
