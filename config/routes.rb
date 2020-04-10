Rails.application.routes.draw do

  devise_for :users
  root 'static_pages#index'

  get '/about', to: 'static_pages#about', as: 'about'
  get '/home', to: 'static_pages#index', as: 'home'
  get '/demo', to: 'static_pages#demo', as: 'demo'
  get '/contribute', to: 'static_pages#contribute', as: 'contribute'

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
end
