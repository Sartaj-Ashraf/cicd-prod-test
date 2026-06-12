"use client";


import {
  TableRow,
  TableCell,
} from "@/components/ui/table";


import LocationActions from "./LocationActions";


export default function LocationRow({ location }: { location: any }) {

  return (
    <>
    <TableRow>
        {/* Actual Name */}
  <TableCell className="text-muted-foreground">
    {location.name}
  </TableCell>

  {/* Nickname */}
  <TableCell className="font-medium">
    {location.nickname || "-"}
  </TableCell>



  {/* Address */}
  <TableCell className="text-muted-foreground text-sm max-w-[300px] truncate">
    {location.address || "-"}
  </TableCell>


  {/* Actions */}
  <TableCell className="text-right flex gap-2 justify-end">
    <LocationActions location={location} />
  </TableCell>

</TableRow>
    </>
  );
}