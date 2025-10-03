"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export default function ClientReservationForm() {
  const [formData, setFormData] = useState({ agree_terms: false });
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const role = searchParams.get("role");

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


    const data = await res.json(); // parse JSON body

    // Log HTTP status + server debug
    console.log("HTTP status:", res.status);
    console.log("Server debug log:", data.debugLog);

    if (!res.ok) {
      throw new Error(data.error || "Failed to submit reservation");
    }

    router.push("/thankyou");
  } catch (err) {
    console.error("Submit error:", err);
    alert(err.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        UNIT RESERVATION REQUEST FORM
      </h1>

      {/* Confirmation line */}
      {id && role && (
        <p className="mb-6">
          The reservation is for <b>{id}</b> as a <b>{role}</b>. <br />
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
        {/* Purchaser Details */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Purchaser Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <h3 className="col-span-full font-medium">Purchaser A</h3>
            <input
              name="purchaserA_name"
              placeholder="Purchaser’s Name"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="purchaserA_nationality"
              placeholder="Nationality"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="purchaserA_passport"
              placeholder="Passport Number"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="purchaserA_email"
              placeholder="Email"
              type="email"
              className="border p-2 rounded"
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <h3 className="col-span-full font-medium">Purchaser B</h3>
            <input
              name="purchaserB_name"
              placeholder="Purchaser’s Name"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="purchaserB_nationality"
              placeholder="Nationality"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="purchaserB_passport"
              placeholder="Passport Number"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="purchaserB_email"
              placeholder="Email"
              type="email"
              className="border p-2 rounded"
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Corporations */}
        <section>
          <h2 className="text-xl font-semibold mb-4">For Corporations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="corp_name"
              placeholder="Corporation Name"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="corp_registration"
              placeholder="Registration Number"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="corp_email"
              placeholder="Email Address"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="corp_address"
              placeholder="Address"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="corp_city"
              placeholder="City"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="corp_country"
              placeholder="Country"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="corp_tel"
              placeholder="Telephone Number"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="corp_mobile"
              placeholder="Mobile Number"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="corp_residence_country"
              placeholder="Permanent Country of Residence"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="corp_residence_phone"
              placeholder="Permanent Residence Phone Number"
              className="border p-2 rounded"
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Payment */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Proof of Payment of Reservation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="reservation_amount"
              placeholder="Reservation Amount (AED)"
              type="number"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <select
              name="payment_mode"
              className="border p-2 rounded"
              onChange={handleChange}
            >
              <option value="">Payment Mode</option>
              <option value="cheque">Cheque</option>
              <option value="transfer">Bank Transfer</option>
            </select>
            <input
              name="cheque_number"
              placeholder="Cheque Number"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="cheque_date"
              type="date"
              className="border p-2 rounded"
              onChange={handleChange}
            />
            <input
              name="bank_name"
              placeholder="Bank Name"
              className="border p-2 rounded"
              onChange={handleChange}
            />
          </div>
        </section>

        {/* Terms */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Terms & Conditions</h2>
          <div className="border p-4 h-40 overflow-y-scroll mb-2 text-sm">
            <p>
              The Purchaser agrees to issue a cheque equivalent to 10% of the total selling price as a booking deposit, which shall be held by
the broker without being deposited and shall either be adjusted against the total purchase price at the time of property transfer
if issued as a manager’s cheque or returned to the Purchaser upon submission of the full manager’s cheque covering the total
price; the Purchaser further undertakes to execute the Dubai Land Department Form F within ten (10) calendar days from the
date of booking and acknowledges that the transaction is facilitated through a registered real estate broker in accordance with
Form B, including disclosure of commission and appointment terms; the Purchaser acknowledges that the unit area stated is
based on net internal measurements and that the registered area with the Dubai Land Department shall be considered final,
with any changes to joint ownership requiring prior written approval of the Seller and payment of applicable administrative
fees; the Purchaser agrees to bear all applicable taxes (including VAT), government charges, and fees imposed now or in the
future, and to reimburse the Seller for any such amounts paid on the Purchaser’s behalf; the Purchaser agrees to indemnify and
hold harmless the Seller and broker from any losses, claims, or liabilities arising from this transaction; the parties agree that
this document constitutes a preliminary agreement and not a binding sale contract, which shall be superseded upon execution
of Form F; and this agreement shall be governed by the laws of the Emirate of Dubai and the applicable Federal Laws of the
UAE, with any disputes subject to the exclusive jurisdiction of the Dubai courts.

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

        {/* CAPTCHA v2 */}
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
            {loading ? "Submitting..." : "Submit Reservation"}
          </button>
        </div>
      </form>
    </div>
  );
}
