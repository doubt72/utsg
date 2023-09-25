Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resource :users, only: [:create] do
        get 'auth', on: :collection
        post 'login', on: :collection
        post 'logout', on: :collection
        post 'validate_code', on: :collection
      end
      # get 'users/index'
      # post 'users/create'
      # get '/show/:id', to: 'users#show'
      # delete '/destroy/:id', to: 'users#destroy'
    end
  end
  root 'home#index'
  get '/*path' => 'home#index'
end
