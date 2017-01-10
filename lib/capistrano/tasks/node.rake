namespace :node do
    desc 'Charge les dependances de NodeJS'
    task :install do
        on roles(:app) do
            within release_path do
                execute :npm, :install
            end
        end
    end

    desc 'Compilation des fichiers avec Gulp'
    task :gulp do
	    on roles(:app) do
            within release_path do
                execute :gulp
            end
        end
    end
end