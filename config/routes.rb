Rails.application.routes.draw do

  resources :users
  resources :clusters
  resources :organizations
  resources :ventilators

  # will get all ventilators for the logged in user's organization
  # todo: determine what to do for super users
  namespace :api do
    namespace :v1 do
      resources :ventilators
    end
  end

  get '/test' => 'home#test'

  # home#index will deliver the single page app bundle
  # So, any URLs that are in the app/javascript/routes
  # should all be listed here for home#index
  # That way, if a user is at e.g. /about and presses refresh
  # the bundle will be re-downloaded and the SPA will open up /about
  root 'home#index'
  get '/about' => 'home#index'
  get '/contribute' => 'home#index'
  get '/demo' => 'home#index'
  get '/' => 'home#index'
end
