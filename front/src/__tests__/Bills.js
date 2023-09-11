/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import Bills from "../containers/Bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import mockStore from "../__mocks__/store";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      expect(windowIcon.classList.contains("active-icon")).toBeTruthy();
    });
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => {
        new Date(a.date) < new Date(b.date) ? 1 : -1;
      };
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });
});

describe("Given I am connected as an employee", () => {
  describe("When I click on new bill", () => {
    test("Then it should render NewBill page", async () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      const myBills = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });

      document.body.innerHTML = BillsUI({ data: bills });

      const handleClickNewBill = jest.fn(() => myBills.handleClickNewBill());
      const btnNewBill = screen.getByTestId("btn-new-bill");
      btnNewBill.addEventListener("click", handleClickNewBill);
      userEvent.click(btnNewBill);

      expect(handleClickNewBill).toHaveBeenCalled();

      await waitFor(() => screen.getByTestId("form-new-bill"));
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
    });
  });
  describe("When I click on icon eye", () => {
    test("Then it should open the bill modal", () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      document.body.innerHTML = BillsUI({ data: bills });

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const myBills = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });

      const handleClickIconEye = jest.fn((icon) =>
        myBills.handleClickIconEye(icon)
      );

      const iconEye = screen.getAllByTestId("icon-eye");

      const modaleFile = document.getElementById("modaleFile");
      $.fn.modal = jest.fn(() => modaleFile.classList.add("show"));
      iconEye.forEach((icon) => {
        icon.addEventListener("click", handleClickIconEye(icon));
        userEvent.click(icon);
        expect(handleClickIconEye).toHaveBeenCalled();
        expect(screen.getByText("Justificatif")).toBeTruthy();
      });

      expect(modaleFile.classList.contains("show")).toBeTruthy();
    });
  });
});

describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to BillsUI", () => {
    test("fetches bills from mock API GET", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "a@a",
        })
      );

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();

      const mockedBills = new Bills({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      document.body.innerHTML = BillsUI({ data: mockedBills });

      await waitFor(() => screen.getByText("Mes notes de frais"));
      expect(screen.getByText("Mes notes de frais")).toBeTruthy();

      const bills = await mockedBills.getBills();
      expect(bills.length > 0).toBeTruthy();
    });
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills");

        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "a@a",
          })
        );

        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);

        router();
      });
      test("fetches bills from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"));
            },
          };
        });

        window.onNavigate(ROUTES_PATH.Bills);

        document.body.innerHTML = BillsUI({ error: "Erreur 404" });
        await new Promise(process.nextTick);

        const message = await screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
      });

      test("fetches messages from an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"));
            },
          };
        });

        window.onNavigate(ROUTES_PATH.Bills);

        document.body.innerHTML = BillsUI({ error: "Erreur 500" });
        await new Promise(process.nextTick);

        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });
    });
  });
});
