Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resource :session, only: %i(create destroy) do
        get 'auth', on: :collection
      end
      resource :user, only: %i(create update destroy) do
        collection do
          post 'new_code'
          post 'validate_code'
          post 'check_conflict'
          post 'set_recovery'
          post 'password_reset'
        end
      end
      resources :messages, only: %i(index create)
    end
  end
  root 'home#index'
  get '/*path' => 'home#index'

  mount ActionCable.server => '/cable'
end
