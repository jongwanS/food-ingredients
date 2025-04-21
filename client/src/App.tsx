import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Home from "@/pages/home";
import Franchises from "@/pages/franchises";
import Products from "@/pages/products";
import ProductDetail from "@/pages/product-detail";
import SearchResults from "@/pages/search-results";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/category/:categoryId" component={Franchises} />
      <Route path="/franchise/:franchiseId" component={Products} />
      <Route path="/product/:productId" component={ProductDetail} />
      <Route path="/search" component={SearchResults} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="container mx-auto px-4 py-8 flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
