// src/components/pottery/AddPotteryForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { addPiece, getCategories } from '@/services/potteryService';
import type { Category, NewPieceData } from '@/types/pottery';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, XCircle, Loader2 } from 'lucide-react';

const MAX_IMAGES = 5;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const formSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters long.' }).max(100),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long.' }).max(1000),
  height: z.coerce.number().positive({ message: 'Height must be a positive number.' }).optional().or(z.literal('')),
  width: z.coerce.number().positive({ message: 'Width must be a positive number.' }).optional().or(z.literal('')),
  depth: z.coerce.number().positive({ message: 'Depth must be a positive number.' }).optional().or(z.literal('')),
  materials: z.string().min(3, { message: 'Materials must be at least 3 characters long.' }).max(200),
  categoryId: z.string({ required_error: 'Please select a category.' }),
  images: z.array(z.string().url({ message: 'Invalid image URL format.' }))
    .min(0)
    .max(MAX_IMAGES, { message: `You can upload a maximum of ${MAX_IMAGES} images.` }),
});

type AddPotteryFormValues = z.infer<typeof formSchema>;

export function AddPotteryForm() {
  const router = useRouter();
  const { userId } = useAuth();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AddPotteryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      materials: '',
      categoryId: '',
      images: [],
      height: '', // Initialize as empty string
      width: '',  // Initialize as empty string
      depth: '',  // Initialize as empty string
    },
  });

  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoadingCategories(true);
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        toast({
          title: 'Error',
          description: 'Could not load categories. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingCategories(false);
      }
    }
    fetchCategories();
  }, [toast]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newImageFiles = [...imageFiles];
      const newImagePreviews = [...imagePreviews];

      for (const file of files) {
        if (newImageFiles.length >= MAX_IMAGES) {
          toast({ title: 'Image Limit Reached', description: `Maximum ${MAX_IMAGES} images allowed.`, variant: 'destructive' });
          break;
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
          toast({ title: 'File Too Large', description: `Image "${file.name}" exceeds ${MAX_FILE_SIZE_MB}MB.`, variant: 'destructive' });
          continue;
        }
        if (!file.type.startsWith('image/')) {
          toast({ title: 'Invalid File Type', description: `"${file.name}" is not a valid image type.`, variant: 'destructive' });
          continue;
        }
        
        newImageFiles.push(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            newImagePreviews.push(reader.result);
            setImagePreviews([...newImagePreviews]); // Trigger re-render
            form.setValue('images', [...newImagePreviews], { shouldValidate: true });
          }
        };
        reader.readAsDataURL(file);
      }
      setImageFiles(newImageFiles);
    }
  };

  const removeImage = (index: number) => {
    const newImageFiles = imageFiles.filter((_, i) => i !== index);
    const newImagePreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newImageFiles);
    setImagePreviews(newImagePreviews);
    form.setValue('images', newImagePreviews, { shouldValidate: true });
  };

  const onSubmit: SubmitHandler<AddPotteryFormValues> = async (data) => {
    if (!userId) {
      toast({ title: 'Authentication Error', description: 'You must be logged in to add a piece.', variant: 'destructive' });
      return;
    }
    if (imagePreviews.length === 0) {
        // This check can be made optional depending on requirements. For now, let's allow items without images.
        // form.setError('images', { type: 'manual', message: 'Please upload at least one image.' });
        // return;
    }

    setIsSubmitting(true);

    const pieceData: NewPieceData = {
      name: data.name,
      description: data.description,
      materials: data.materials,
      categoryId: data.categoryId,
      imageUrls: imagePreviews, // Pass the data URIs
      height: data.height === '' ? undefined : Number(data.height),
      width: data.width === '' ? undefined : Number(data.width),
      depth: data.depth === '' ? undefined : Number(data.depth),
    };

    try {
      const newPiece = await addPiece(pieceData, userId);
      toast({
        title: 'Success!',
        description: `"${newPiece.name}" has been added to your collection.`,
      });
      router.push('/'); // Redirect to homepage or to the new piece's detail page: `/pottery/${newPiece.id}`
    } catch (error) {
      console.error('Failed to add pottery piece:', error);
      toast({
        title: 'Submission Failed',
        description: 'Could not add your pottery piece. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Pottery Piece</CardTitle>
        <CardDescription>Fill in the details of your new creation.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Rustic Serving Bowl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your piece, its inspiration, techniques used, etc." {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="25" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value))}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="15" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value))}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="depth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Depth (cm)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="15" {...field} onChange={e => field.onChange(e.target.value === '' ? '' : parseFloat(e.target.value))}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="materials"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Materials Used</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Stoneware clay, Celadon glaze" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingCategories}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select a category"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="images"
                render={({ field }) => ( // field is not directly used for input type="file" but needed for RHF
                <FormItem>
                  <FormLabel>Images (up to {MAX_IMAGES}, {MAX_FILE_SIZE_MB}MB each)</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                                <p className="mb-1 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WebP up to {MAX_FILE_SIZE_MB}MB</p>
                            </div>
                            <Input id="dropzone-file" type="file" className="hidden" multiple accept="image/*" onChange={handleImageChange} disabled={imageFiles.length >= MAX_IMAGES || isSubmitting} />
                        </label>
                    </div>
                  </FormControl>
                  <FormDescription>
                    {imagePreviews.length > 0 ? `${imagePreviews.length} image(s) selected.` : 'No images selected yet.'}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {imagePreviews.map((previewUrl, index) => (
                  <div key={index} className="relative group aspect-square">
                    <Image
                      src={previewUrl}
                      alt={`Preview ${index + 1}`}
                      fill // Changed from layout="fill" objectFit="cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                      className="rounded-md object-cover"
                      data-ai-hint="pottery preview"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-70 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                      disabled={isSubmitting}
                    >
                      <XCircle className="h-4 w-4" />
                      <span className="sr-only">Remove image</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting || isLoadingCategories}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Piece...
                </>
              ) : (
                'Add Pottery Piece'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
