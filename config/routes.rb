Rails.application.routes.draw do

  devise_for :users, controllers: { registrations: 'users/registrations' }
  root 'static_pages#index'

  get '/home', to: 'static_pages#index', as: 'home'
  get '/about', to: 'static_pages#about', as: 'about'
  get '/contribute', to: 'static_pages#contribute', as: 'contribute'

  resources :users, controller: "users", only: [:index, :edit, :update, :show]
  resources :clusters
  resources :organizations
  resources :ventilators

  # will get all ventilators for the logged in user's organization
  # todo: determine what to do for super users
  namespace :api do
    namespace :v1 do
      resources :ventilators, controller: "ventilators", only: [:index]
    end
  end
end
