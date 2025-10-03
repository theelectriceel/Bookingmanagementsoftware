"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function Broker() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const role = searchParams.get("role");
  const [formData, setFormData] = useState({ agree_terms: false });
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
 
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agree_terms) {
      alert("You must agree to the Terms & Conditions before submitting.");
      return;
    }

    if (!captchaToken) {
      alert("Please complete the CAPTCHA.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/reservation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        captchaToken,
        unitId: id,
        role,
      }),
    });


      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to submit form");
      }

      router.push("/thankyou");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        AGENT TO AGENT AGREEMENT FORM
      </h1>

      {id && role && (
        <p className="mb-6">
          Form reference: <b>{id}</b> as <b>{role}</b>.
          <br />
          If this information is incorrect please return{" "}
          <span
            onClick={() => router.push("/flatsgallery")}
            className="text-blue-500 cursor-pointer underline"
          >
            here
          </span>
          .
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-10 bg-white shadow-lg rounded-xl p-8"
      >
        {/* Section 1: Agreement Details */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Agreement Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="brn_number"
              placeholder="BRN #"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="str_number"
              placeholder="STR #"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="date"
              type="date"
              placeholder="Date"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="valid_till"
              type="date"
              placeholder="Valid Till Date"
              className="border p-2 rounded"
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Section 2: Seller Agent */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Seller’s Agent Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="seller_agent_name"
              placeholder="Agent Name"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="seller_agent_establishment"
              placeholder="Establishment Name"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="seller_agent_address"
              placeholder="Address"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="seller_agent_tel"
              placeholder="Tel"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="seller_agent_fax"
              placeholder="Fax"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="seller_agent_email"
              placeholder="Email"
              type="email"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="seller_agent_orn"
              placeholder="ORN"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="seller_agent_license"
              placeholder="Ded. License"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="seller_agent_pobox"
              placeholder="P.O. Box"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="seller_agent_registered_name"
              placeholder="Registered Agent Name"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="seller_agent_brn"
              placeholder="BRN"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="seller_agent_mobile"
              placeholder="Mobile"
              className="border p-2 rounded"
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Section 3: Buyer Agent */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Buyer’s Agent Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="buyer_agent_name"
              placeholder="Agent Name"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="buyer_agent_establishment"
              placeholder="Establishment Name"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="buyer_agent_address"
              placeholder="Address"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="buyer_agent_tel"
              placeholder="Tel"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="buyer_agent_fax"
              placeholder="Fax"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="buyer_agent_email"
              placeholder="Email"
              type="email"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="buyer_agent_orn"
              placeholder="ORN"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="buyer_agent_license"
              placeholder="Ded. License"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="buyer_agent_pobox"
              placeholder="P.O. Box"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="buyer_agent_registered_name"
              placeholder="Registered Agent Name"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="buyer_agent_brn"
              placeholder="BRN"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="buyer_agent_mobile"
              placeholder="Mobile"
              className="border p-2 rounded"
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Section 4: Property */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Property Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="property_address"
              placeholder="Property Address"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="master_developer"
              placeholder="Master Developer"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="master_project_name"
              placeholder="Master Project Name"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="building_name"
              placeholder="Building Name"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="listed_price"
              placeholder="Listed Price"
              type="number"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              className="border p-2 rounded col-span-full"
              onChange={handleChange}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="mou_exists"
                checked={formData.mou_exists}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span>MOU Exists</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_tenanted"
                checked={formData.is_tenanted}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span>Is Tenanted</span>
            </label>
            <input
              name="maintenance_fee"
              placeholder="Maintenance Fee P.A."
              className="border p-2 rounded"
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Section 5: Commission */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Commission Split</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="seller_commission"
              placeholder="Seller’s Commission"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="buyer_commission"
              placeholder="Buyer’s Commission"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="buyer_name"
              placeholder="Buyer Name (Family)"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <select
              name="transfer_fee_paid_by"
              className="border p-2 rounded"
              onChange={handleChange}
            >
              <option value="">Transfer Fee Paid By</option>
              <option value="seller">Seller</option>
              <option value="buyer">Buyer</option>
              <option value="negotiable">Negotiable</option>
            </select>
            <input
              name="budget"
              placeholder="Budget"
              type="number"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="prefinance_approval"
                checked={formData.prefinance_approval}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span>Buyer Has Pre-finance Approval</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="buyer_contacted_listing_agent"
                checked={formData.buyer_contacted_listing_agent}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <span>Buyer Contacted Listing Agent</span>
            </label>
          </div>
        </section>

        {/* Terms */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>
          <div className="border p-4 h-40 overflow-y-scroll mb-2 text-sm">
            <p>
               <span className="font-bold"> Declaration by the Agent “A”</span>
               <br></br>
            I hereby declare, I have read and understood the Real Estate Code of Ethics, I have a current signed Seller’s Agreement FORM A, I shall respond to a reasonable offer to purchase the listed property from Agent B, and shall not contact Agent B’s Buyer nor confer with their client under no circumstances unless the nominated Buyer herein has already discussed the stated listed property with our Office. 
            <br></br>
            <span className="font-bold"> Declaration by the Agent “B”</span>
            <br></br>
            I hereby declare, I have read and understood the Real Estate Code of Ethics, I have a current signed Seller’s Agreement FORM A, I shall respond to a reasonable offer to purchase the listed property from Agent B, and shall not contact Agent B’s Buyer nor confer with their client under no circumstances unless the nominated Buyer herein has already discussed the stated listed property with our Office. 
I hereby declare, I have read and understood the Real Estate Code of Ethics, I have a current signed Buyer’s Agreement Form B, I shall encourage my Buyer as name herein, to submit a reasonable offer for the stated property and not contact Agent A’s Seller nor confer with their client under no circumstances unless the Agent A has delayed our proposal on the prescribed FORM with a reasonable reply within 24 hours. 


            </p>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="agree_terms"
              checked={formData.agree_terms}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>I agree to the Terms & Conditions</span>
          </label>
        </section>

        {/* CAPTCHA */}
        <div className="flex justify-center mt-6">
          <ReCAPTCHA
            sitekey='6LdeLdorAAAAAKbbDfvdDpHaXaqbptzZ5FpAqKjK'
            onChange={(token) => setCaptchaToken(token)}
          />
        </div>

        {/* Submit */}
        <div className="text-center mt-6">
          <button
            type="submit"
            disabled={!formData.agree_terms || loading}
            className={`px-6 py-3 rounded-lg text-white ${
              formData.agree_terms && !loading
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? "Submitting..." : "Submit Agreement"}
          </button>
        </div>
      </form>
    </div>
  );
}
