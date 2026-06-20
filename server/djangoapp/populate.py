from .models import CarMake, CarModel

def initiate():
    # 1. Clean out existing database state to prevent constraint violations
    CarModel.objects.all().delete()
    CarMake.objects.all().delete()

    # 2. Add real, verified historical data for Car Manufactures
    car_make_data = [
        {"name": "NISSAN", "description": "Nissan Motor Co., Ltd. Japanese multinational automobile manufacturer.", "country_of_origin": "Japan", "established_year": 1933},
        {"name": "Mercedes", "description": "Mercedes-Benz AG. Luxury and commercial vehicle automotive brand.", "country_of_origin": "Germany", "established_year": 1926},
        {"name": "Audi", "description": "Audi AG. German manufacturer of luxury vehicles, a member of the Volkswagen Group.", "country_of_origin": "Germany", "established_year": 1909},
        {"name": "Kia", "description": "Kia Corporation. South Korean multinational automobile manufacturer.", "country_of_origin": "South Korea", "established_year": 1944},
        {"name": "Toyota", "description": "Toyota Motor Corporation. Japanese multinational automotive manufacturer.", "country_of_origin": "Japan", "established_year": 1937},
    ]

    car_make_instances = []
    for data in car_make_data:
        instance = CarMake.objects.create(
            name=data['name'], 
            description=data['description'],
            country_of_origin=data['country_of_origin'],
            established_year=data['established_year']
        )
        car_make_instances.append(instance)

    # 3. Add authentic production specifications linked directly to an active image CDN
    car_model_data = [
        # NISSAN (car_make_instances[0])
        {
            "name": "Pathfinder", "type": "SUV", "year": 2023, "car_make": car_make_instances[0],
            "trim_level": "Platinum", "engine_type": "ICE", "transmission": "AUTOMATIC", 
            "base_price": 50600.00, "image_url": "https://images.unsplash.com/photo-1567818735868-e71b99932e29?auto=format&fit=crop&w=800&q=80"
        },
        {
            "name": "Qashqai", "type": "SUV", "year": 2023, "car_make": car_make_instances[0],
            "trim_level": "Tekna", "engine_type": "ICE", "transmission": "CVT", 
            "base_price": 32000.00, "image_url": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80"
        },
        {
            "name": "XTRAIL", "type": "SUV", "year": 2023, "car_make": car_make_instances[0],
            "trim_level": "ST-L e-POWER", "engine_type": "HEV", "transmission": "AUTOMATIC", 
            "base_price": 42000.00, "image_url": "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80"
        },
        
        # Mercedes-Benz (car_make_instances[1])
        {
            "name": "A-Class", "type": "SEDAN", "year": 2023, "car_make": car_make_instances[1],
            "trim_level": "A220 AMG Line", "engine_type": "ICE", "transmission": "AUTOMATIC", 
            "base_price": 39500.00, "image_url": "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80"
        },
        {
            "name": "C-Class", "type": "SEDAN", "year": 2023, "car_make": car_make_instances[1],
            "trim_level": "C300e", "engine_type": "PHEV", "transmission": "AUTOMATIC", 
            "base_price": 46000.00, "image_url": "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&w=800&q=80"
        },
        {
            "name": "E-Class", "type": "SEDAN", "year": 2023, "car_make": car_make_instances[1],
            "trim_level": "E450 4MATIC", "engine_type": "ICE", "transmission": "AUTOMATIC", 
            "base_price": 65500.00, "image_url": "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80"
        },
        
        # Audi (car_make_instances[2])
        {
            "name": "A4", "type": "SEDAN", "year": 2023, "car_make": car_make_instances[2],
            "trim_level": "Premium Plus", "engine_type": "ICE", "transmission": "AUTOMATIC", 
            "base_price": 42000.00, "image_url": "https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=800&q=80"
        },
        {
            "name": "A5", "type": "COUPE", "year": 2023, "car_make": car_make_instances[2],
            "trim_level": "S Line Edition", "engine_type": "ICE", "transmission": "AUTOMATIC", 
            "base_price": 47500.00, "image_url": "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=800&q=80"
        },
        {
            "name": "A6", "type": "SEDAN", "year": 2023, "car_make": car_make_instances[2],
            "trim_level": "Prestige", "engine_type": "ICE", "transmission": "AUTOMATIC", 
            "base_price": 56900.00, "image_url": "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80"
        },
        
        # Kia (car_make_instances[3])
        {
            "name": "Sorrento", "type": "SUV", "year": 2023, "car_make": car_make_instances[3],
            "trim_level": "SX Prestige", "engine_type": "HEV", "transmission": "AUTOMATIC", 
            "base_price": 43000.00, "image_url": "https://images.unsplash.com/photo-1655821888788-6107699e1700?auto=format&fit=crop&w=800&q=80"
        },
        {
            "name": "Carnival", "type": "VAN", "year": 2023, "car_make": car_make_instances[3],
            "trim_level": "SX", "engine_type": "ICE", "transmission": "AUTOMATIC", 
            "base_price": 41800.00, "image_url": "https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&w=800&q=80"
        },
        {
            "name": "Cerato", "type": "SEDAN", "year": 2023, "car_make": car_make_instances[3],
            "trim_level": "GT Line", "engine_type": "ICE", "transmission": "AUTOMATIC", 
            "base_price": 25000.00, "image_url": "https://images.unsplash.com/photo-1623854275632-e06283ec31d8?auto=format&fit=crop&w=800&q=80"
        },
        
        # Toyota (car_make_instances[4])
        {
            "name": "Corolla", "type": "SEDAN", "year": 2023, "car_make": car_make_instances[4],
            "trim_level": "LE Hybrid", "engine_type": "HEV", "transmission": "CVT", 
            "base_price": 23050.00, "image_url": "https://images.unsplash.com/photo-1621007947382-cc347941fd17?auto=format&fit=crop&w=800&q=80"
        },
        {
            "name": "Camry", "type": "SEDAN", "year": 2023, "car_make": car_make_instances[4],
            "trim_level": "XSE V6", "engine_type": "ICE", "transmission": "AUTOMATIC", 
            "base_price": 36600.00, "image_url": "https://images.unsplash.com/photo-1621007974902-0941977f904b?auto=format&fit=crop&w=800&q=80"
        },
        {
            "name": "Kluger", "type": "SUV", "year": 2023, "car_make": car_make_instances[4],
            "trim_level": "Grande", "engine_type": "HEV", "transmission": "CVT", 
            "base_price": 54000.00, "image_url": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
        }
    ]

    for data in car_model_data:
        CarModel.objects.create(
            name=data['name'], 
            car_make=data['car_make'], 
            type=data['type'], 
            year=data['year'],
            trim_level=data['trim_level'],
            engine_type=data['engine_type'],
            transmission=data['transmission'],
            base_price=data['base_price'],
            image_url=data['image_url']
        )