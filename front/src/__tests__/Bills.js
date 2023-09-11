/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
import router from "../app/Router.js";

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
