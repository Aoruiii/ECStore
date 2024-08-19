using API.Data;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext context;

        public BasketController(StoreContext context)
        {
            this.context = context;
        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket();

            if (basket == null) return NotFound();
            return MapBasketToDto(basket);
        }


        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity)
        {
            // get the basket
            var basket = await RetrieveBasket();
            if (basket == null) basket = CreateBasket();
            // get the product
            var product = await context.Products.FindAsync(productId);
            if (product == null) return NotFound();
            // Add product to basket
            basket.AddItem(product, quantity);
            // save changes
            var result = await context.SaveChangesAsync();
            if (result > 0) return CreatedAtRoute("GetBasket", MapBasketToDto(basket));
            return BadRequest(new ProblemDetails { Title = "Problem adding item to basket" });
        }


        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity)
        {
            // get the basket
            var basket = await RetrieveBasket();

            if (basket == null) return NotFound();
            // Remove product or reduce quantity
            basket.RemoveItem(productId, quantity);
            // save changes
            var result = await context.SaveChangesAsync();
            if (result > 0) return Ok();
            return BadRequest(new ProblemDetails { Title = "Problem removing item from basket" });
        }

        private async Task<Basket> RetrieveBasket()
        {
            return await context.Baskets
            .Include(i => i.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(basket => basket.BuyerId == Request.Cookies["buyerId"]);
        }
        private Basket CreateBasket()
        {
            var buyerId = Guid.NewGuid().ToString();
            var cookieOptions = new CookieOptions { IsEssential = true, Expires = DateTime.Now.AddDays(30) };
            Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            var basket = new Basket { BuyerId = buyerId };
            context.Baskets.Add(basket);
            return basket;
        }
        private BasketDto MapBasketToDto(Basket basket)
        {
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(i => new BasketItemDto
                {
                    ProductId = i.ProductId,
                    Name = i.Product.Name,
                    Price = i.Product.Price,
                    PictureUrl = i.Product.PictureUrl,
                    Brand = i.Product.Brand,
                    Type = i.Product.Type,
                    Quantity = i.Quantity

                }).ToList()
            };
        }
    }
}