/**
 * @jest-environment jsdom
 */
import userEvent from "@testing-library/user-event";
import { fireEvent, screen, waitFor } from "@testing-library/dom";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js";
import router from "../app/Router.js";
import NewBill from "../containers/NewBill.js";
import NewBillUI from "../views/NewBillUI.js";
import BillsUI from "../views/BillsUI.js";

jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then mail icon should be highlighted", async () => {
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
      window.onNavigate(ROUTES_PATH.NewBill);
      await waitFor(() => screen.getByTestId("icon-mail"));
      const mailIcon = screen.getByTestId("icon-mail");
      expect(mailIcon.classList.contains("active-icon")).toBeTruthy();
    });
  });
});

describe("Given I am connected as an employee", () => {
  describe("When user uploads a file", () => {
    describe("When the file is an image with png, jpeg or jpg extension", () => {
      test("Then, it should be uploaded", () => {
        jest.spyOn(mockStore, "bills");

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        Object.defineProperty(window, "location", {
          value: { hash: ROUTES_PATH["NewBill"] },
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );

        const html = NewBillUI();
        document.body.innerHTML = html;

        const newBillInit = new NewBill({
          document,
          onNavigate,
          store: mockStore,
          localStorage: window.localStorage,
        });

        const handleChangeFile = jest.fn((e) =>
          newBillInit.handleChangeFile(e)
        );
        const formNewBill = screen.getByTestId("form-new-bill");

        const file = new File(["image"], "image.png", { type: "image/png" });
        const billFile = screen.getByTestId("file");

        billFile.addEventListener("change", handleChangeFile);
        userEvent.upload(billFile, file);
        fireEvent.change(billFile, {
          target: {
            files: [file],
          },
        });

        expect(billFile.files[0].name).toBeDefined();
        expect(billFile.files[0]).toBe(file);
        expect(billFile.files).toHaveLength(1);
        expect(handleChangeFile).toBeCalled();
        expect(handleChangeFile).toHaveBeenCalled();
        expect(handleChangeFile).toBeTruthy();

        const handleSubmit = jest.fn((e) => newBillInit.handleSubmit(e));
        formNewBill.addEventListener("submit", handleSubmit);
        fireEvent.submit(formNewBill);
        expect(handleSubmit).toHaveBeenCalled();
      });
    });
  });
  describe("When the file is not an image with png, jpeg or jpg extension", () => {
    test("Then, it should not be uploaded", () => {
      jest.spyOn(mockStore, "bills");

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      Object.defineProperty(window, "location", {
        value: { hash: ROUTES_PATH["NewBill"] },
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );

      const html = NewBillUI();
      document.body.innerHTML = html;

      const newBillInit = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      const handleChangeFile = jest.fn((e) => newBillInit.handleChangeFile(e));

      const file = new File(["test.pdf"], "test.pdf", { type: "document/pdf" });
      const billFile = screen.getByTestId("file");

      billFile.addEventListener("change", handleChangeFile);
      userEvent.upload(billFile, file);
      fireEvent.change(billFile, {
        target: {
          target: { files: [file] },
        },
      });

      const errorMessage = screen.getByTestId("file-error");

      expect(handleChangeFile).toHaveBeenCalled();
      expect(billFile.value).not.toBe("test.pdf");
      expect(errorMessage.textContent).toEqual(
        expect.stringContaining(
          "Le fichier doit être une image en PNG,JPEG ou JPG"
        )
      );
      expect(errorMessage.classList.contains("msg-block")).toBeTruthy();
    });
  });
});

describe("Given I am connected as an employee", () => {
  describe("When user submits data for new bill", () => {
    test("Then it should create a new bill containing that data", async () => {
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
          email: "a@a.com",
        })
      );

      const html = NewBillUI();
      document.body.innerHTML = html;

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });
      const validBill = {
        type: "Services en ligne",
        name: "test3",
        date: "2003-03-03",
        amount: 300,
        vat: 60,
        pct: 20,
        commentary: "ok",
        fileUrl:
          "https://test.storage.tld/v0/b/billable-677b6.a…dur.png?alt=media&token=571d34cb-9c8f-430a-af52-66221cae1da3",
        fileName:
          "facture-client-php-exportee-dans-document-pdf-enregistre-sur-disque-dur.png",
        status: "accepted",
      };

      screen.getByTestId("expense-type").value = validBill.type;
      screen.getByTestId("expense-name").value = validBill.name;
      screen.getByTestId("datepicker").value = validBill.date;
      screen.getByTestId("amount").value = validBill.amount;
      screen.getByTestId("vat").value = validBill.vat;
      screen.getByTestId("pct").value = validBill.pct;
      screen.getByTestId("commentary").value = validBill.commentary;
      newBill.fileName = validBill.fileName;
      newBill.fileUrl = validBill.fileUrl;

      newBill.updateBill = jest.fn();
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));

      const form = screen.getByTestId("form-new-bill");
      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);

      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
