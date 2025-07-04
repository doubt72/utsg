# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resource :session, only: %i[create destroy] do
        get "auth", on: :collection
      end
      resource :user, only: %i[create update destroy] do
        collection do
          post "new_code"
          post "validate_code"
          post "check_conflict"
          post "set_recovery"
          post "password_reset"
          get "stats"
        end
      end
      resources :messages, only: %i[index create]
      resources :games, only: %i[index show create update] do
        member do
          post "join"
          post "leave"
          post "start"
          post "finish"
          post "resign"
        end
      end
      resources :game_actions, only: %i[index create] do
        member do
          post "undo"
        end
      end
      resources :scenarios, only: %i[index show] do
        collection do
          get "allied_factions"
          get "axis_factions"
          get "all_units"
        end
        member do
          get "stats"
        end
      end
      resources :ratings, only: %i[create] do
        collection do
          get "single"
          get "average"
        end
      end
    end
  end
  root "home#index"
  get "/*path" => "home#index"

  mount ActionCable.server => "/cable"
end
