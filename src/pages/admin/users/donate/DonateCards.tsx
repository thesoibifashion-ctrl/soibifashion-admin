"use client";

import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, Clock } from "lucide-react";

interface Donation {
  _id: string;
  fullname: string;
  currency: string;
  amount: number;
  isConfirmed: boolean;
}

// const mockDonations: Donation[] = [
//   {
//     _id: "1",
//     fullname: "John Doe",
//     currency: "NGN",
//     amount: 50000,
//     isConfirmed: true,
//   },
//   {
//     _id: "2",
//     fullname: "Jane Smith",
//     currency: "NGN",
//     amount: 20000,
//     isConfirmed: false,
//   },
//   {
//     _id: "3",
//     fullname: "Michael Lee",
//     currency: "USD",
//     amount: 100,
//     isConfirmed: true,
//   },
//   {
//     _id: "4",
//     fullname: "Sarah Johnson",
//     currency: "USD",
//     amount: 250,
//     isConfirmed: false,
//   },
//   {
//     _id: "5",
//     fullname: "David Okafor",
//     currency: "GBP",
//     amount: 75,
//     isConfirmed: true,
//   },
//   {
//     _id: "6",
//     fullname: "Amaka Chukwu",
//     currency: "NGN",
//     amount: 15000,
//     isConfirmed: true,
//   },
// ];

interface DonationStatsProps {
  donations?: Donation[];
}

const TotalDonationsCard = ({ donations }: { donations: Donation[] }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("");

  const availableCurrencies = useMemo(() => {
    return Array.from(new Set(donations.map((d) => d.currency)));
  }, [donations]);

  const currency = selectedCurrency || availableCurrencies[0] || "";

  const filtered = useMemo(() => {
    return donations.filter((d) => d.currency === currency);
  }, [donations, currency]);

  const confirmed = filtered.filter((d) => d.isConfirmed);

  const total = confirmed.reduce((sum, d) => sum + d.amount, 0);
  const count = confirmed.length;

  return (
    <div className="p-6 rounded-[16px] border border-[#E2E2E2] flex flex-col gap-3 flex-1 bg-[linear-gradient(233.89deg,_#A0F88A_-3.62%,_#186D0F_47.04%)]">
      {" "}
      <div className="flex items-center justify-between">
        <p className="font-medium text-sm text-[#ffffffca]">Total Donations</p>

        <Select value={currency} onValueChange={setSelectedCurrency}>
          <SelectTrigger className="w-24 h-8 text-xs text-white border-[#E2E2E2]">
            <SelectValue placeholder="—" />
          </SelectTrigger>
          <SelectContent>
            {availableCurrencies.map((c) => (
              <SelectItem className="" key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <p className="font-semibold text-3xl text-[white]">
        {currency} {total.toLocaleString()}
      </p>
      <p className="text-xs text-[#9AA09B]">
        from {count} confirmed donation{count !== 1 ? "s" : ""}
      </p>
    </div>
  );
};

const TotalDonorsCard = ({ donations }: { donations: Donation[] }) => {
  // unique donors by fullname  swap to a real donor id if the backend has one
  const uniqueDonors = useMemo(() => {
    return new Set(donations.map((d) => d.fullname)).size;
  }, [donations]);

  return (
    <div className="p-6 bg-white rounded-[16px] border border-[#E2E2E2] flex flex-col gap-3 flex-1">
      <div className="flex items-center justify-between">
        <p className="font-medium text-sm text-[#404944]">Total Donors</p>
        <Users size={18} className="text-[#186D0F]" />
      </div>

      <p className="font-semibold text-3xl text-[#002E21]">{uniqueDonors}</p>

      <p className="text-xs text-[#9AA09B]">unique contributors</p>
    </div>
  );
};

const PendingVerificationsCard = ({ donations }: { donations: Donation[] }) => {
  const pending = useMemo(() => {
    return donations.filter((d) => !d.isConfirmed);
  }, [donations]);

  const pendingCount = pending.length;

  const pendingByCurrency = useMemo(() => {
    const totals: Record<string, number> = {};
    pending.forEach((d) => {
      totals[d.currency] = (totals[d.currency] ?? 0) + d.amount;
    });
    return totals;
  }, [pending]);

  return (
    <div className="p-6 bg-white rounded-[16px] border border-[#E2E2E2] flex flex-col gap-3 flex-1">
      <div className="flex items-center justify-between">
        <p className="font-medium text-sm text-[#404944]">
          Pending Verifications
        </p>
        <Clock size={18} className="text-[#D97706]" />
      </div>

      <p className="font-semibold text-3xl text-[#002E21]">{pendingCount}</p>

      <p className="text-xs text-[#9AA09B]">
        {pendingCount > 0
          ? Object.entries(pendingByCurrency)
              .map(([cur, amt]) => `${cur} ${amt.toLocaleString()}`)
              .join(" · ")
          : "awaiting confirmation"}
      </p>
    </div>
  );
};

const DonationStats = ({ donations }: DonationStatsProps) => {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {(donations?.length ?? 0) > 0 && (
        <>
          <TotalDonationsCard donations={donations!} />
          <TotalDonorsCard donations={donations!} />
          <PendingVerificationsCard donations={donations!} />
        </>
      )}
    </div>
  );
};

export default DonationStats;