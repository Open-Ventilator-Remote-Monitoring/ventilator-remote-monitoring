Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html

  root 'static_pages#index'

  get '/about', to: 'static_pages#about', as: 'about'
  get '/home', to: 'static_pages#index', as: 'home'
  get '/demo', to: 'static_pages#demo', as: 'demo'

end
