import { supabase } from '@/lib/supabase';

export const listAssetForSale = async (
  assetId: string, 
  assetName: string, 
  price: number, 
  type: 'livestock' | 'crops',
  quantity: string
) => {
  // Update the inventory table to reflect it is listed
  const { error: updateError } = await supabase
    .from(type)
    .update({ market_status: 'listed' }) // This must match the SQL column
    .eq('id', assetId);

  if (updateError) throw updateError;

  // Insert the public record into the marketplace
  const { error: insertError } = await supabase
    .from('marketplace_listings')
    .insert([{
      asset_id: assetId,
      asset_name: assetName,
      asset_type: type,
      price_ksh: price,
      quantity: quantity,
      status: 'active',
      location: 'Nairobi, Kenya' // Default for now
    }]);

  return { error: insertError };
};