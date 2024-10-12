## In this small library, you can use typescript object/methods for building route/api urls.
### 1.First step - create interface with all routings in your web app.

```
interface IAppRoute {
  auth: {
    account: {
      id: (id?: string) => IUrlItem;
    };
    login: IUrlItem;
  };
}
```
### 2.Seccond step - create object and call createUrls() method with similar implementation
```
const appRoutes = createUrls<IAppRoute>({
  auth: {
    login: EMPTY_URL_ITEM,
    account: {
      id: (id?: string) => EMPTY_URL_ITEM,
    },
  },
});
```
### 3. Example of usage.
```
axios.get(appRoutes.auth.account.id("e87a8340-1a81-4013-a8c8-c5ab8ec205ea")) // instead axios.get("/auth/check/e87a8340-1a81-4013-a8c8-c5ab8ec205ea")
...
describe("create-urls", () => {
  it("test urls", () => {
    expect(appRoutes.auth).toEqual("/auth");
    expect(appRoutes.auth.login).toEqual("/auth/login");
    expect(appRoutes.auth.account.id()).toEqual("/auth/check/:id");
    expect(appRoutes.auth.account.id("e87a8340-1a81-4013-a8c8-c5ab8ec205ea").toEqual("/auth/check/e87a8340-1a81-4013-a8c8-c5ab8ec205ea");
  });
});
```
