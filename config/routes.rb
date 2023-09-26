Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resource :user, only: %i(create update destroy) do
        collection do
          post 'new_code'
          post 'validate_code'
          post 'check_conflict'
          post 'set_recovery'
          post 'password_reset'
        end
      end
      resource :session, only: %i(create destroy) do
        get 'auth', on: :collection
      end
    end
  end
  root 'home#index'
  get '/*path' => 'home#index'
end
