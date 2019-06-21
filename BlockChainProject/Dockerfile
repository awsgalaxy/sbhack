FROM microsoft/dotnet:2.1-aspnetcore-runtime AS base
WORKDIR /app
EXPOSE 63805
EXPOSE 44326

FROM microsoft/dotnet:2.1-sdk AS build
WORKDIR /src
COPY BlockChainProject/BlockChainProject.csproj BlockChainProject/
RUN dotnet restore BlockChainProject/BlockChainProject.csproj
COPY . .
WORKDIR /src/BlockChainProject
RUN dotnet build BlockChainProject.csproj -c Release -o /app

FROM build AS publish
RUN dotnet publish BlockChainProject.csproj -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "BlockChainProject.dll"]
