Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resource :user, only: %i(create update destroy) do
        collection do
          post 'new_code'
          post 'validate_code'
          post 'check_conflict'
          post 'password_reset'
        end
      end
      resource :session, only: %i(create destroy) do
        get 'auth', on: :collection
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
