"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Store } from "lucide-react"
import { listAssetForSale } from "@/services/marketplace"

interface ListAssetModalProps {
  isOpen: boolean
  onClose: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  asset: any
  onSuccess: () => void
}

export function ListAssetModal({ isOpen, onClose, asset, onSuccess }: ListAssetModalProps) {
  const [price, setPrice] = useState("")
  const [loading, setLoading] = useState(false)

  const handleListing = async () => {
    if (!price || isNaN(Number(price))) return

    try {
      setLoading(true)
      const { error } = await listAssetForSale(
        asset.id,
        `${asset.species} (Tag: ${asset.tag_number})`,
        Number(price),
        'livestock',
        "1 Head" // Standard quantity for livestock
      )

      if (!error) {
        onSuccess()
        onClose()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
      setPrice("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-emerald-600" />
            Marketplace Listing
          </DialogTitle>
          <DialogDescription>
            Enlist Tag {asset?.tag_number} for sale. This will make it visible to buyers in the marketplace.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="price">Asking Price (Ksh)</Label>
            <Input
              id="price"
              type="number"
              placeholder="e.g. 45000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="col-span-3 font-mono font-bold text-emerald-600"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleListing} 
            disabled={loading || !price}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Confirm Listing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}