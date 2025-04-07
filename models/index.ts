import mongoose from "mongoose";
import { UserModel } from "./user";
import { OrganizationModel } from "./organization";
import { MemberModel } from "./members";
import { CustomerModel } from "./customers";
import { VendorModel } from "./vendor";
import { ProductModel } from "./products";
import { OrderModel } from "./order";
import { InventoryModel } from "./inventory";
import { InvoiceModel } from "./invoice";


class Models {
  public User: typeof UserModel;
  public Organization: typeof OrganizationModel;
  public Member: typeof MemberModel;
  public Customer :typeof CustomerModel;
  public Vendor: typeof VendorModel ;
  public Product : typeof ProductModel ;
  public Order : typeof OrderModel ;
  public Inventory : typeof InventoryModel;
  public Invoice :  typeof InvoiceModel;

  constructor() {
    this.User = UserModel;
    this.Organization = OrganizationModel;
    this.Member = MemberModel;
    this.Customer = CustomerModel;
    this.Vendor = VendorModel;
    this.Product= ProductModel;
    this.Order= OrderModel;
    this.Inventory =InventoryModel;
    this.Invoice = InvoiceModel
  }
}

const models = new Models();
export default models;
