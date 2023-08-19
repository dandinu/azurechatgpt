# ☁️ Deploy to Azure - GitHub Actions

The following steps describes how ChatGPT on Azure solution accelerator can be deployed to Azure App service using GitHub Actions.

# 🧬 Fork the repository

Fork this repository to your own organisation so that you can execute GitHub Actions against your own Azure Subscription.

1. Clone the `.env.local` file and name it `.env.production` to store the production environment variables. Modify the `NEXTAUTH_URL` variable with your azure App Service URL:

```
NEXTAUTH_URL=https://<APP NAME>.azurewebsites.net
```

# Check environment variables on Azure too
You need to make sure that the environment variables from your `env.production` file are set there, too. If you don't, then your app on Azure won't be able to authenticate with GitHub/AD correctly.

On Azure App Service -

Open the Azure portal
Navigate to your `app service`
Open the settings menu and select `Configuration`
In the `Application settings` tab, add new entries for `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` or any other environment variables you are missing, under App settings, and save the changes
Remember to keep these variables secure - they provide access to your GitHub/AD app and should not be disclosed publicly.

![](/images/app-services-variables.png)

# 🗝️ Configure secrets in your GitHub repository

### 1. AZURE_CREDENTIALS

The GitHub workflow requires a secret named `AZURE_CREDENTIALS` to authenticate with Azure. The secret contains the credentials for a service principal with the Contributor role on the resource group containing the container app and container registry.

1. Create a service principal with the Contributor role on the resource group that contains the Azure App Service.

   ```
   az ad sp create-for-rbac --name <NAME OF THE CREDENTIAL> --role contributor --scopes /subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP> --sdk-auth --output json
   ```

2. Copy the JSON output from the command.

3. In the GitHub repository, navigate to Settings > Secrets > Actions and select New repository secret.

4. Enter `AZURE_CREDENTIALS` as the name and paste the contents of the JSON output as the value.

5. Select **Add secret**.

### 2. AZURE_APP_SERVICE_NAME

Under the same repository secrets add a new variable `AZURE_APP_SERVICE_NAME` to deploy to your Azure Web app. The value of this secret is the name of your Azure Web app e.g. `my-web-app-name` from the domain https://my-web-app-name.azurewebsites.net/

# 🔄 Run GitHub Actions

Once the secrets are configured, the GitHub Actions will be triggered for every code push to the repository. Alternatively, you can manually run the workflow by clicking on the "Run Workflow" button in the Actions tab in GitHub.

![](/images/runworkflow.png)

# Deploy the app manually (Without Github Actions).

Do an npm install and npm run build like so:
```
cd ./src
npm install
npm run build --if-present
cd ..
```
Copy standalone into the root
```
cp -R ./src/.next/standalone ./site-deploy
```
Copy static into the .next folder
```
cp -R ./src/.next/static ./site-deploy/.next/static
```
Copy Public folder
```
cp -R ./src/public ./site-deploy/public
```
Create a zip of your Next application
```
cd ./site-deploy
zip Nextjs-site.zip ./* .next -qr
```
Deploy to a Web App via REST API cURL command or using Azure CLI
```
az functionapp deployment source config-zip -g <resource_group> -n \
<app_name> --src Nextjs-site.zip
```
or
```
curl -X POST \
    --data-binary "@Nextjs-site.zip" \
    -H "Authorization: Bearer <access_token>" \
    "https://<app_name>.scm.azurewebsites.net/api/zipdeploy"
```

[Next](/docs/5-add-Identity.md)

